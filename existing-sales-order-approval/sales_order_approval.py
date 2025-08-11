import json
import os
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Body, UploadFile, File
from loguru import logger
from pydantic import BaseModel, Extra
from sqlalchemy.orm import Session
from os import mkdir, listdir, getenv
import re

from fastapi.responses import FileResponse
import base64

from src.routes import get_db, get_raw_db
import psycopg2.extras

from src.utils.jwt_utils import verify_token
from src.utils.misc import cache_and_get_request_data

router = APIRouter()

def is_safe_query(sql_query):
    # Define a list of DDL keywords
    ddl_keywords = ['UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'INSERT', 'TRUNCATE']

    # Convert the SQL query to uppercase for case-insensitive matching
    sql_query_upper = sql_query.upper()

    # Use regular expression to check for the presence of DDL keywords
    ddl_pattern = r'\b(?:' + '|'.join(ddl_keywords) + r')\b'
    match = re.search(ddl_pattern, sql_query_upper)

    # If a match is found, the query is not safe
    if match:
        return False
    else:
        return True


sales_order_table_select_columns = """
    soa.id,
    soa.sono,
    soa.so_status,
    soa.customer_name,
    soa.product_name,
    soa.comments,
    0 as assigned_designer,
    u.username as created_by_username,
    adu.username as assigned_designer_username,
    soa.costing_approved,
    soa.qa_approved,
    soa.is_final_authorized,
    soa.designer_approved,
    soa.final_qa_approved,
    soa.pm_approved,
    soa.plant_email_sent,
    soa.current_status,
    soa.created_time,
    soa.updated_by,
    soa.updated_time
"""
class SalesOrderApprovalTable(BaseModel):
    created_by: Optional[List[int]] = []
    current_status: Optional[List[str]] = []
    from_time: Optional[str] = ""
    to_time: Optional[str] = ""
    costing_approved: Optional[int] = -1
    qa_approved: Optional[int] = -1
    is_final_authorized: Optional[int] = -1
    designer_approved: Optional[int] = -1
    final_qa_approved: Optional[int] = -1
    pm_approved: Optional[int] = -1

@router.post('/sales-order-approval-table', tags=["SO Approval"], description="")
async def all_current_so_list(
        clause: SalesOrderApprovalTable,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:

        # token_data = verify_token(request.headers.get("Authorization", ""))
        # user_id = token_data.get("user_id")
        # return user_id

        where_clause = ""
        if len(clause.created_by) > 0:
            where_clause += f" AND soa.created_by IN ({', '.join([str(i) for i in clause.created_by])})"
        if len(clause.current_status) > 0:
            in_clause = ", ".join([f"'{i}'" for i in clause.current_status])
            where_clause += f" AND soa.current_status IN ({in_clause})"
        if clause.from_time != "" and clause.to_time != "":
            where_clause += f" AND soa.created_time BETWEEN '{clause.from_time}' AND '{clause.to_time}'"

        if clause.costing_approved != -1:
            where_clause += f" AND soa.costing_approved = {clause.costing_approved}"
        if clause.qa_approved != -1:
            where_clause += f" AND soa.qa_approved = {clause.qa_approved}"
        if clause.is_final_authorized != -1:
            where_clause += f" AND soa.is_final_authorized = {clause.is_final_authorized}"
        if clause.designer_approved != -1:
            where_clause += f" AND soa.designer_approved = {clause.designer_approved}"
        if clause.final_qa_approved != -1:
            where_clause += f" AND soa.final_qa_approved = {clause.final_qa_approved}"
        if clause.pm_approved != -1:
            where_clause += f" AND soa.pm_approved = {clause.pm_approved}"


        # print(where_clause)
        # return where_clause

        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            SELECT 
                (SELECT soaq.company_name
                 FROM sales_order_approval_quotation_products soap
                          JOIN sales_order_approval_quotation soaq ON soaq.quotation_id = soap.quotation_id
                 WHERE soap.sales_order_approval_id = soa.id
                 ORDER BY soaq.created_time DESC
                 LIMIT 1)                        as company_name,
                {sales_order_table_select_columns}
            FROM sales_order_approval soa
                LEFT JOIN users u ON u.srno = soa.created_by
                LEFT JOIN users adu ON adu.srno = soa.assigned_designer
            WHERE soa.is_deleted=0 {where_clause}
            ORDER BY soa.updated_time DESC
        """)
        result = cursor.fetchall()

        return {"data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


@router.get('/sales-order-approval-table-for-me', tags=["SO Approval"], description="")
async def all_current_so_list_for_me(
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        token_data = verify_token(request.headers.get("Authorization", ""))
        user_id = token_data.get("user_id")
        permissions = token_data.get("role", {}).get("sales_order_approval", {})

        where_clauses_arr = []
        if permissions.get("bd", False):
            where_clauses_arr.append(f"""
                created_by = {user_id}
                AND
                (
                    current_status IN ('IN-PROGRESS', 'SO-CONFIRMED', 'REQUEST-CHANGES')
                    OR
                    (
                        current_status = 'ADDED-TO-PROGEN'
                        AND
                        (
                            costing_approved = 0
                            OR qa_approved = 0
                            OR is_final_authorized = 0
                            OR designer_approved = 0
                            OR final_qa_approved = 0
                            OR pm_approved = 0
                        )
                    )
                )
            """)
        if permissions.get("costing_admin", False):
            where_clauses_arr.append(f"""
                current_status IN ('SO-CONFIRMED', 'ADDED-TO-PROGEN', 'REQUEST-CHANGES') 
                AND costing_approved = 0
            """)
        if permissions.get("qa_admin", False):
            where_clauses_arr.append(f"""
                current_status IN ('SO-CONFIRMED', 'ADDED-TO-PROGEN', 'REQUEST-CHANGES')
                AND costing_approved = 1
                AND qa_approved = 0
            """)
        if permissions.get("final_authorization_admin", False):
            where_clauses_arr.append(f"""
                current_status IN ('SO-CONFIRMED', 'ADDED-TO-PROGEN', 'REQUEST-CHANGES')
                AND costing_approved = 1
                AND qa_approved = 1
                AND is_final_authorized = 0
            """)
        if permissions.get("progen_data_entry", False):
            where_clauses_arr.append(f"""
                current_status = "REQUEST-CHANGES"
                OR
                (
                    current_status = "SO-CONFIRMED"
                    AND costing_approved = 1
                    AND qa_approved = 1
                    AND is_final_authorized = 1
                )
            """)

        if permissions.get("design_admin", False):
            where_clauses_arr.append(f"""
                current_status IN ('SO-CONFIRMED', 'ADDED-TO-PROGEN', 'REQUEST-CHANGES')
                AND costing_approved = 1
                AND qa_approved = 1
                AND is_final_authorized = 1
                AND designer_approved = 0
            """)

        if permissions.get("final_qa_admin", False):
            where_clauses_arr.append(f"""
                current_status IN ('SO-CONFIRMED', 'ADDED-TO-PROGEN', 'REQUEST-CHANGES')
                AND costing_approved = 1
                AND qa_approved = 1
                AND is_final_authorized = 1
                AND designer_approved = 1
                AND final_qa_approved = 0
            """)

        if permissions.get("pm_admin", False):
            where_clauses_arr.append(f"""
                current_status IN ('SO-CONFIRMED', 'ADDED-TO-PROGEN', 'REQUEST-CHANGES')
                AND costing_approved = 1
                AND qa_approved = 1
                AND is_final_authorized = 1
                AND designer_approved = 1
                AND final_qa_approved = 1
                AND pm_approved = 0
            """)

        # where_str = "WHERE " + " OR ".join([f"({i})" for i in where_clauses_arr]) if len(where_clauses_arr) > 0 else ""
        where_str = " OR ".join([f"({i})" for i in where_clauses_arr]) if len(where_clauses_arr) > 0 else ""

        if not len(where_str) or not is_safe_query(where_str):
            raise HTTPException(status_code=400, detail="Unsafe query!")

        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        query = f"""
            SELECT
                (SELECT soaq.company_name
                 FROM sales_order_approval_quotation_products soap
                          JOIN sales_order_approval_quotation soaq ON soaq.quotation_id = soap.quotation_id
                 WHERE soap.sales_order_approval_id = soa.id
                 ORDER BY soaq.created_time DESC
                 LIMIT 1)                        as company_name,
                {sales_order_table_select_columns}
            FROM sales_order_approval soa
                LEFT JOIN users u ON u.srno = soa.created_by
                LEFT JOIN users adu ON adu.srno = soa.assigned_designer
            WHERE soa.is_deleted=0 AND ({where_str})
            ORDER BY soa.updated_time DESC
        """
        # print(query)
        cursor.execute(query)
        result = cursor.fetchall()

        return {"data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


class SaveSalesOrderApproval(BaseModel):
    id: int
    save_diff: Optional[dict] = {}

    class Config:
        extra = Extra.allow

@router.post('/save-sales-order-approval', tags=["SO Approval"], description="")
async def save_sales_order_approval(
        data: SaveSalesOrderApproval,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        token_data = verify_token(request.headers.get("Authorization", ""))
        user_id = token_data.get("user_id")
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # print(f"testing-so-route {user_id}")
        # Now printing only those which are present in the model
        # for key, value in data.dict().items():
        #     print(f"{key} : {value}")

        # Checking if the id exists in sales_order_approval table
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"SELECT * FROM sales_order_approval WHERE id = {data.id}")
        result = cursor.fetchall()

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"Invalid id!")

        # If id exists, then update all the fields that are present in the model except the id field
        update_columns_eqaul_to_data = [
            f"updated_time = '{current_time}'",
            f"updated_by = {user_id}"
        ]
        for key, value in data.dict().items():
            if key not in ["id", "save_diff"]:
                update_columns_eqaul_to_data.append(f"{key} = '{value}'")
        query = f"""
            UPDATE sales_order_approval SET 
                {', '.join(update_columns_eqaul_to_data)}
            WHERE id = {data.id}    
        """

        # print(query)
        # return data

        cursor.execute(query)
        rdb.commit()

        query = f"""
            INSERT INTO sales_order_approval_save_transactions (
                sales_order_approval_id,
                diff,
                created_time,
                created_by
            ) VALUES (
                {data.id},
                '{json.dumps(data.save_diff)}',
                '{current_time}',
                {user_id}
            )
        """
        cursor.execute(query)
        rdb.commit()

        return data
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


@router.get('/get-sales-order-approval-by-id', tags=["SO Approval"], description="")
async def get_sales_order_approval_by_id(
        id: int,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            SELECT 
                u.username as created_by_username,
                soa.* 
            FROM sales_order_approval soa
                LEFT JOIN users u ON u.srno = soa.created_by
            WHERE id = {id}
        """)
        result = cursor.fetchall()

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"Invalid id!")

        return {"data": result[0]}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")

class CreateSalesOrderApproval(BaseModel):
    so_status: str
    dosage_name: str
# Other thigs to initialize
# created_by
# created_time
# updated_by
# updated_time
# current_status = "IN-PROGRESS"
# manufacturer_name = "CIAN HEALTHCARE"

# Create a new row in sales_order_approval table and return the id
@router.post('/create-sales-order-approval', tags=["SO Approval"], description="")
async def create_sales_order_approval(
        data: CreateSalesOrderApproval,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        token_data = verify_token(request.headers.get("Authorization", ""))
        user_id = token_data.get("user_id")
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # return data
        query = f"""
            INSERT INTO sales_order_approval (
                so_status,
                dosage_name,
                created_by,
                created_time,
                updated_by,
                updated_time,
                current_status,
                manufacturer_name
            ) VALUES (
                '{data.so_status}',
                '{data.dosage_name}',
                {user_id},
                '{current_time}',
                {user_id},
                '{current_time}',
                'IN-PROGRESS',
                'CIAN HEALTHCARE'
            )
        """
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(query)
        rdb.commit()

        cursor.execute(f"SELECT CURRVAL('sales_order_approval_id_seq') as id")
        result = cursor.fetchall()
        return {"id": result[0]["id"]}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")



@router.get('/get-sales-order-approval-save-transactions-by-id', tags=["SO Approval"], description="")
async def get_sales_order_approval_save_transactions_by_id(
        id: int,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            SELECT soast.*, u.username as created_by_username
            FROM sales_order_approval_save_transactions soast 
                LEFT JOIN users u ON u.srno = soast.created_by
            WHERE sales_order_approval_id = {id}
            ORDER BY created_time DESC
        """)
        result = cursor.fetchall()

        return {"data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")

@router.get('/get-sales-order-approval-comments-by-id', tags=["SO Approval"], description="")
async def get_sales_order_approval_comments_by_id(
        id: int,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            SELECT soac.*, u.username as created_by_username
            FROM sales_order_approval_comments soac 
                LEFT JOIN users u ON u.srno = soac.created_by
            WHERE sales_order_approval_id = {id}
            ORDER BY created_time DESC
        """)
        result = cursor.fetchall()

        return {"data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


class SaveSalesOrderApprovalComments(BaseModel):
    id: int
    comments: str
    status: str
    type: str

@router.post('/save-sales-order-approval-comments', tags=["SO Approval"], description="")
async def save_sales_order_approval_comments(
        data: SaveSalesOrderApprovalComments,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        token_data = verify_token(request.headers.get("Authorization", ""))
        user_id = token_data.get("user_id")
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Checking if the id exists in sales_order_approval table
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"SELECT * FROM sales_order_approval WHERE id = {data.id}")
        result = cursor.fetchall()

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"Invalid id!")

        query = f"""
            INSERT INTO sales_order_approval_comments (
                sales_order_approval_id,
                comments,
                status,
                type,
                created_time,
                created_by
            ) VALUES (
                {data.id},
                '{data.comments}',
                '{data.status}',
                '{data.type}',
                '{current_time}',
                {user_id}
            )
        """
        cursor.execute(query)
        rdb.commit()

        # "costing_approval" | "qa_approval" | "final_authorization" | "designer_approval" | "final_qa_approval" | "pm_approval"
        type_to_column_name_map = {
            "costing_approval": "costing_approved",
            "qa_approval": "qa_approved",
            "final_authorization": "is_final_authorized",
            "designer_approval": "designer_approved",
            "final_qa_approval": "final_qa_approved",
            "pm_approval": "pm_approved",
        }
        # APPROVE || REQUEST CHANGES
        if data.status == "APPROVE":
            query = f"""
                UPDATE sales_order_approval SET 
                    {type_to_column_name_map[data.type]} = 1,
                    updated_time = '{current_time}',
                    updated_by = {user_id}
                WHERE id = {data.id}    
            """
        else:
            query = f"""
                UPDATE sales_order_approval SET 
                    {type_to_column_name_map[data.type]} = 0,
                    updated_time = '{current_time}',
                    updated_by = {user_id}
                WHERE id = {data.id}
            """

        cursor.execute(query)
        rdb.commit()

        return data
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")



@router.post('/upload-file-so-approval/{id}/{tag}', tags=["SO Approval"], description="")
async def upload_file_so_approval(
        request: Request,
        id: int,
        tag: str,
        file:  UploadFile = File(...),
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        token_data = verify_token(request.headers.get("Authorization", ""))
        user_id = token_data.get("user_id")
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Checking if the id exists in sales_order_approval table
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"SELECT * FROM sales_order_approval WHERE id = {id}")
        result = cursor.fetchall()

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"Invalid id!")


        # Checking id the folder for this month exists
        # Current month => mm_yyyy
        current_month = datetime.now().strftime("%m_%Y")
        if current_month not in listdir(getenv("FILES_BASE_PATH") + "\saved_files\sales_order_approval"):
            mkdir(getenv("FILES_BASE_PATH") + "/saved_files/sales_order_approval/" + current_month)
        # Now we make a folder for this id
        if str(id) not in listdir(getenv("FILES_BASE_PATH") + f"\saved_files\sales_order_approval\{current_month}"):
            mkdir(getenv("FILES_BASE_PATH") + f"/saved_files/sales_order_approval/{current_month}/{id}")

        # generate a uuid and save the file
        uuid_ = str(uuid.uuid4())
        # file_main_path = f"/saved_files/sales_order_approval/{current_month}/{uuid_}_{id}_{file.filename}"
        file_main_path = f"/saved_files/sales_order_approval/{current_month}/{id}/{uuid_}_{file.filename}"
        file_path = getenv("FILES_BASE_PATH") + file_main_path
        with open(file_path, "wb") as f:
            f.write(file.file.read())
            f.close()

        query = f"""
            INSERT INTO sales_order_approval_documents (
                sales_order_approval_id,
                tag,
                file_type,
                file_name,
                file_path,
                metadata,
                created_time,
                created_by,
                is_deleted
            ) VALUES (
                {id},
                '{tag}',
                '{file.content_type}',
                '{file.filename}',
                '{file_main_path}',
                '{json.dumps({})}',
                '{current_time}',
                {user_id},
                0
            )
        """
        # Execute the query
        cursor.execute(query)
        rdb.commit()

        return { "file_path": file_path }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


@router.delete('/delete-file-so-approval', tags=["SO Approval"], description="")
async def delete_file_so_approval(
        document_id: int,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        token_data = verify_token(request.headers.get("Authorization", ""))
        user_id = token_data.get("user_id")
        # return True

        # Checking if the id exists in sales_order_approval table
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"SELECT * FROM sales_order_approval_documents WHERE document_id = {document_id}")
        result = cursor.fetchall()

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"Invalid id!")

        query = f"""
            UPDATE sales_order_approval_documents SET 
                is_deleted = 1
            WHERE document_id = {document_id}    
        """
        cursor.execute(query)
        rdb.commit()

        # Remove the file from the disk
        file_path = getenv("FILES_BASE_PATH") + result[0]["file_path"]
        if os.path.exists(file_path):
            os.remove(file_path)


        return { "message": "File deleted successfully!" }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


@router.get('/get-sales-order-approval-document-file', tags=["SO Approval"], description="")
async def get_sales_order_approval_document_file(
        document_id: int,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        # token_data = verify_token(request.headers.get("Authorization", ""))
        # user_id = token_data.get("user_id")

        # Checking if the id exists in sales_order_approval table
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"SELECT * FROM sales_order_approval_documents WHERE document_id = {document_id}")
        result = cursor.fetchall()

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"Invalid id!")

        file_path = getenv("FILES_BASE_PATH") + result[0]["file_path"]
        if os.path.exists(file_path):
            return FileResponse(file_path)
            # with open(file_path, "rb") as f:
            #     return base64.b64encode(f.read()).decode('utf-8')
        else:
            raise HTTPException(status_code=404, detail=f"File not found!")

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


@router.get('/get-sales-order-approval-documents-by-id', tags=["SO Approval"], description="")
async def get_sales_order_approval_documents_by_id(
        id: int,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            SELECT soad.*, u.username as created_by_username
            FROM sales_order_approval_documents soad
                LEFT JOIN users u ON u.srno = soad.created_by
            WHERE soad.sales_order_approval_id = {id} AND soad.is_deleted = 0
        """)
        result = cursor.fetchall()

        return {"data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


def distinct_product_name_options(cursor):
    cursor.execute(f"""
        select DISTINCT 
            itemcd as item_code,
            itemname as item_name,
            itemname as value,
            itemname as label
        from perp2012.itemmst
        where (itemtpcd = 'FG' Or itemtpcd = 'TR')
        and isrecclsd = 0
    """)
    result = cursor.fetchall()
    return result


@router.get('/get-all-product-options', tags=["SO Approval"], description="")
async def all_product_names_options(
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        return {"data": distinct_product_name_options(cursor)}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


def distinct_customer_name_options(cursor):
    cursor.execute(f"""
        SELECT
            CustName as label,
            CustName as value,
            CustName as customer_name,
            CustCd as customer_code,
            GSTIN as gst_no,
            Country as country
        FROM perp2012.custmst
    """)
    result = cursor.fetchall()
    return result

@router.get('/get-all-customer-options', tags=["SO Approval"], description="")
async def all_customer_names_options(
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        return {"data": distinct_customer_name_options(cursor)}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


def get_all_field_options(rdb):
    all_options = {}

    cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute(f"""
        SELECT
            PropName as prop_key,
            PropValue as value
        FROM perp2012.itallprp
    """)
    result = cursor.fetchall()
    for row in result:
        if row["prop_key"] not in all_options:
            all_options[row["prop_key"]] = []
        all_options[row["prop_key"]].append({
            "label": row["value"],
            "value": row["value"],
        })

    cursor.execute(f"""
        SELECT
            PayTerms as label,
            PayTerms as value
        FROM perp2012.pytrmmst
    """)
    result = cursor.fetchall()
    all_options["payment_term"] = result

    cursor.execute(f"""
        SELECT
            PgName as label,
            PgName as value
        FROM perp2012.pgmst
    """)
    result = cursor.fetchall()
    all_options["division_and_design_under"] = result

    all_options["product_name"] = distinct_product_name_options(cursor)
    all_options["customer_name"] = distinct_customer_name_options(cursor)

    return all_options


@router.get('/sales-order-approval-all-field-options', tags=["SO Approval"], description="")
async def sales_order_approval_all_field_options(
        request: Request,
        refetch_from_db: Optional[bool] = False,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        token_data = verify_token(request.headers.get("Authorization", ""))
        user_id = token_data.get("user_id")
        field_options_file_path = getenv("FILES_BASE_PATH") + '/saved_files/sales_order_approval/cached_requests/sales_order_approval_all_field_options.json'

        data = cache_and_get_request_data(field_options_file_path, 3600, refetch_from_db, get_all_field_options, (rdb))

        return {"data": data}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


def get_previous_stock_details(cursor, item_code):
    cursor.execute(f"""
        SELECT I.ITEMCD,I.ITEMNAME,i.itsubtpcd,SUM((b.OPGQTY+b.GRNACCQTY+b.GrnRejQty+b.othmrcgqty)
            - (b.MISGQTY + b.MISBQTY + b.PRNGQTY + b.PRNBQTY)) AS stk
        FROM perp2012.BINBTBAL b
                 INNER JOIN perp2012.ITEMMST I
                            ON B.ITEMCD = I.ITEMCD
        WHERE b.loccd = 'MRK'
          AND B.storecd = 'PMS'
          and i.isrecclsd = 0
          and i.oldcode = '{item_code}'
        group by b.itemcd
    """)
    result = cursor.fetchall()
    map_keys = {
        "P-CARTON": "pm_outer_ctn_stock",
        "P-ICARTON": "pm_inner_ctn_stock",
        "P-FOIL": "pm_foil_stock",
        "LEAFLET": "pm_leaflet_stock",
        "P-TUBE": "pm_tube_stock",
        "P-LABEL": "pm_label_stock",
    }
    final_result = {}
    for row in result:
        if row["itsubtpcd"] in map_keys:
            final_result[map_keys[row["itsubtpcd"]]] = row["stk"]

    return final_result

@router.get('/get-previous-so-details-for-product', tags=["SO Approval"], description="")
async def get_previous_so_details_for_product(
        product_name: str,
        item_code: str,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            select quodate,
                   podate,
                   pono,
                   itemcd,
                   itemname,
                   composition,
                   custname,
                   mobileno,
                   dept,
                   mgname,
            
                   ROUND(poqty, 2) AS poqty,
                   rate            As rate,
                   mrp,
                   ROUND(amt, 2)   As amt,
                   dosage,
                   pack,
                   quodays,
                   noofdays,
                   division,
                   paytermcd,
                   shelflife,
                   hsn_code,
            
                   loccd,
                   postatus,
                   TXTPCD,
                   artworkcode,
                   authdttm,
                   authind,
                   comment
            from ((SELECT so.custorddt                                          as quodate,
                          st.SODT                                               AS podate,
                          st.SOID                                               AS pono,
                          i.itemcd,
                          i.itemname,
            
                          CAST(i.ItemSpecs AS CHAR(10000) CHARACTER SET utf8)   as composition,
                          c.custname,
                          c.mobileno,
            
                          i.sldivcd                                             AS dept,
                          mg.mgname,
                          ROUND(st.saleqty, 2)                                  AS poqty,
                          st.bsrt                                               as rate,
                          ROUND(st.mrp, 2)                                      as mrp,
            
                          CAST(so.ExtInfo AS CHAR(10000) CHARACTER SET utf8)    AS postatus,
                          ROUND(st.bsval, 2)                                    AS amt,
                          i.itsubtpcd                                           as dosage,
            
                          CAST(i.extinfo AS CHAR(10000) CHARACTER SET utf8)     as pack,
                          DATEDIFF(NOW(), so.custorddt)                         as quodays,
            
                          DATEDIFF(st.SODT, so.custorddt)                       as noofdays,
                          p.PgName                                              AS division,
                          so.paytermcd,
                          i.shlfmth                                             as shelflife,
                          i.hsnsaccd                                            as hsn_code,
            
                          so.loccd,
                          SO.TXTPCD,
            
            
                          CAST(st.itextinfo AS CHAR(10000) CHARACTER SET utf8)  as artworkcode,
                          so.authdttm,
                          so.authind,
            
                          CAST(st.custprdref AS CHAR(10000) CHARACTER SET utf8) as comment
            
                   FROM perp2012.sodt st
                            inner join perp2012.itemmst i
                                       on st.itemcd = i.itemcd
                            inner join perp2012.sohd so on so.soid = st.soid
                            inner join perp2012.custmst c on st.custcd = c.custcd
                            inner join perp2012.mgmst mg on st.mgcd = mg.mgcd
                            inner join perp2012.custpmst ct on c.custtpcd = ct.custtpcd
                            left join perp2012.pgmst p ON i.pgcd = p.pgcd
                   where so.yrid <> 1718
                   group by st.SOID)
            
                  UNION ALL
                  (SELECT st.ftODT                                            AS quodate,
                          st.ftODT                                            AS podate,
                          st.ftOID                                            AS pono,
            
                          i.itemcd,
                          i.itemname,
                          CAST(i.ItemSpecs AS CHAR(10000) CHARACTER SET utf8) as composition,
            
                          'Cian'                                              as custname,
                          ''                                                  as mobileno,
                          i.sldivcd                                           AS dept,
                          'PCD'                                               as mgname,
                          ROUND(st.ftoqty, 2)                                 AS poqty,
            
                          st.bsrt                                             as rate,
                          CAST(so.EXTINFO AS CHAR(10000) CHARACTER SET utf8)  AS mrp,
            
                          CAST(so.EXTINFO AS CHAR(10000) CHARACTER SET utf8)  AS postatus,
                          ROUND(st.ftoqty * st.bsrt, 2)                       AS amt,
            
                          i.itsubtpcd                                         as dosage,
                          CAST(i.extinfo AS CHAR(10000) CHARACTER SET utf8)   as pack,
            
                          DATEDIFF(NOW(), st.ftODT)                           as quodays,
                          DATEDIFF(NOW(), st.ftODT)                           as noofdays,
            
                          p.PgName                                            AS division,
                          ''                                                  as paytermcd,
                          i.shlfmth                                           as shelflife,
                            i.hsnsaccd                                          as hsn_code,
            
                          so.loccd,
                          SO.TXTPCD,
                          ''                                                  as artworkcode,
            
                          so.authdttm,
                          so.authind,
                          ''                                                  as comment
                   FROM perp2012.ftodt st
                            inner join perp2012.itemmst i
                                       on st.itemcd = i.itemcd
                            inner join perp2012.ftohd so on so.ftoid = st.ftoid
                            left join perp2012.pgmst p ON i.pgcd = p.pgcd
            
                   where so.yrid <> 1718
                     and so.TxSrsCd <> 'SPL'
                   group by st.ftOID)) AS A
            where a.ItemCd ='{item_code}'
--               and a.loccd = 'MRK'
              ORDER BY podate DESC
              LIMIT 1
        """)
              # AND a.authind = '1'
        result = cursor.fetchall()

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"Proudct not found!")

        data = result[0]
        # Extend the data with previous stock details
        data.update(get_previous_stock_details(cursor, item_code))

        return {"data": data}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")

@router.get('/get-so-details-for-soid', tags=["SO Approval"], description="")
async def get_previous_so_details_for_product(
        soid: str,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        if len(soid) == 0:
            raise HTTPException(status_code=404, detail=f"SO Not Found!")

        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            select quodate,
                   podate,
                   pono,
                   itemcd,
                   itemname,
                   composition,
                   custname,
                   mobileno,
                   dept,
                   mgname,
            
                   ROUND(poqty, 2) AS poqty,
                   rate            As rate,
                   mrp,
                   ROUND(amt, 2)   As amt,
                   dosage,
                   pack,
                   quodays,
                   noofdays,
                   division,
                   paytermcd,
                   shelflife,
                   hsn_code,
            
                   loccd,
                   postatus,
                   TXTPCD,
                   artworkcode,
                   authdttm,
                   authind,
                   comment
            from ((SELECT so.custorddt                                          as quodate,
                          st.SODT                                               AS podate,
                          st.SOID                                               AS pono,
                          i.itemcd,
                          i.itemname,
            
                          CAST(i.ItemSpecs AS CHAR(10000) CHARACTER SET utf8)   as composition,
                          c.custname,
                          c.mobileno,
            
                          i.sldivcd                                             AS dept,
                          mg.mgname,
                          ROUND(st.saleqty, 2)                                  AS poqty,
                          st.bsrt                                               as rate,
                          ROUND(st.mrp, 2)                                      as mrp,
            
                          CAST(so.ExtInfo AS CHAR(10000) CHARACTER SET utf8)    AS postatus,
                          ROUND(st.bsval, 2)                                    AS amt,
                          i.itsubtpcd                                           as dosage,
            
                          CAST(i.extinfo AS CHAR(10000) CHARACTER SET utf8)     as pack,
                          DATEDIFF(NOW(), so.custorddt)                         as quodays,
            
                          DATEDIFF(st.SODT, so.custorddt)                       as noofdays,
                          p.PgName                                              AS division,
                          so.paytermcd,
                          i.shlfmth                                             as shelflife,
                          i.hsnsaccd                                            as hsn_code,
            
                          so.loccd,
                          SO.TXTPCD,
            
            
                          CAST(st.itextinfo AS CHAR(10000) CHARACTER SET utf8)  as artworkcode,
                          so.authdttm,
                          so.authind,
            
                          CAST(st.custprdref AS CHAR(10000) CHARACTER SET utf8) as comment
            
                   FROM perp2012.sodt st
                            inner join perp2012.itemmst i
                                       on st.itemcd = i.itemcd
                            inner join perp2012.sohd so on so.soid = st.soid
                            inner join perp2012.custmst c on st.custcd = c.custcd
                            inner join perp2012.mgmst mg on st.mgcd = mg.mgcd
                            inner join perp2012.custpmst ct on c.custtpcd = ct.custtpcd
                            left join perp2012.pgmst p ON i.pgcd = p.pgcd
                   where so.yrid <> 1718
                   AND st.soid = '{soid}'
                   group by st.SOID)
            
                  UNION ALL
                  (SELECT st.ftODT                                            AS quodate,
                          st.ftODT                                            AS podate,
                          st.ftOID                                            AS pono,
            
                          i.itemcd,
                          i.itemname,
                          CAST(i.ItemSpecs AS CHAR(10000) CHARACTER SET utf8) as composition,
            
                          'Cian'                                              as custname,
                          ''                                                  as mobileno,
                          i.sldivcd                                           AS dept,
                          'PCD'                                               as mgname,
                          ROUND(st.ftoqty, 2)                                 AS poqty,
            
                          st.bsrt                                             as rate,
                          CAST(so.EXTINFO AS CHAR(10000) CHARACTER SET utf8)  AS mrp,
            
                          CAST(so.EXTINFO AS CHAR(10000) CHARACTER SET utf8)  AS postatus,
                          ROUND(st.ftoqty * st.bsrt, 2)                       AS amt,
            
                          i.itsubtpcd                                         as dosage,
                          CAST(i.extinfo AS CHAR(10000) CHARACTER SET utf8)   as pack,
            
                          DATEDIFF(NOW(), st.ftODT)                           as quodays,
                          DATEDIFF(NOW(), st.ftODT)                           as noofdays,
            
                          p.PgName                                            AS division,
                          ''                                                  as paytermcd,
                          i.shlfmth                                           as shelflife,
                            i.hsnsaccd                                          as hsn_code,
            
                          so.loccd,
                          SO.TXTPCD,
                          ''                                                  as artworkcode,
            
                          so.authdttm,
                          so.authind,
                          ''                                                  as comment
                   FROM perp2012.ftodt st
                            inner join perp2012.itemmst i
                                       on st.itemcd = i.itemcd
                            inner join perp2012.ftohd so on so.ftoid = st.ftoid
                            left join perp2012.pgmst p ON i.pgcd = p.pgcd
            
                   where so.yrid <> 1718
                     and so.TxSrsCd <> 'SPL'
                        AND st.ftOID = '{soid}'
                   group by st.ftOID)) AS A
            where pono ='{soid}'
--               and a.loccd = 'MRK'
        """)
        result = cursor.fetchall()

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"SO Not Found!")

        data = result[0]

        return {"data": data}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


@router.get('/get-sales-order-approval-chat-comments', tags=["SO Approval"], description="")
async def get_sales_order_approval_chat_comments(
        sales_order_approval_id: int,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            SELECT soac.*, u.username as created_by_username
            FROM sales_order_approval_chat soac 
                LEFT JOIN users u ON u.srno = soac.created_by
            WHERE sales_order_approval_id = {sales_order_approval_id}
            ORDER BY created_time ASC 
        """)
        result = cursor.fetchall()


        return {"data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")

class AddSalesOrderApprovalChatComment(BaseModel):
    sales_order_approval_id: int
    comment: str

@router.post('/add-sales-order-approval-chat-comment', tags=["SO Approval"], description="")
async def add_sales_order_approval_chat_comment(
        data: AddSalesOrderApprovalChatComment,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        token_data = verify_token(request.headers.get("Authorization", ""))
        user_id = token_data.get("user_id")
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        query = f"""
            INSERT INTO sales_order_approval_chat (
                sales_order_approval_id,
                comment,
                created_time,
                created_by
            ) VALUES (
                {data.sales_order_approval_id},
                '{data.comment.replace("'", "''")}',
                '{current_time}',
                {user_id}
            )
        """
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(query)
        rdb.commit()


        # Also update the updated time in sales_order_approval table
        query = f"""
            UPDATE sales_order_approval SET 
                updated_time = '{current_time}',
                updated_by = {user_id}
            WHERE id = {data.sales_order_approval_id}    
        """
        cursor.execute(query)
        rdb.commit()


        return {"message": "Comment added successfully!"}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")


@router.get('/get-customer-details', tags=["SO Approval"], description="")
async def get_customer_details(
        customer_name: str,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            SELECT
                Contact as contact_person,
                MobileNo AS contact_number,
                EMailId AS email,
                CONCAT(AddLine1, AddLine2, AddLine3, ' | zipcode - ', ZipCode, ', ', City, ', ', StateCd)    AS address
            FROM perp2012.custmst
            WHERE custname like '{customer_name}%'
        """)
        result = cursor.fetchall()

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"Customer not found!")

        return {"data": result[0]}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"{e}")

"""
create table cianerp_16_17.sales_order_approval_quotation
(
    quotation_id            int auto_increment
        primary key,
    created_time            timestamp     null,
    created_by              int           null,
    is_deleted              int default 0 null,
    company_name            varchar(200)  null,
    quotation_number        varchar(200)  null,
    quotation_date          date          null,
    customer_name           varchar(200)  null,
    customer_contact_person varchar(200)  null,
    customer_mobile_number  varchar(200)  null,
    customer_email          varchar(200)  null,
    advance_percentage      float         null,
    charges                 text          null,
    total_amount             float         null,
    advance_amount          float         null,
    constraint quotation_id
        unique (quotation_id)
);

create table cianerp_16_17.sales_order_approval_quotation_products
(
    id                                int auto_increment
        primary key,
    quotation_id                      int           null,
    sales_order_approval_id           int           null,
    is_deleted                        int default 0 null,
    product_name                      varchar(200)  null,
    composition                       text          null,
    dosage_name                       varchar(200)  null,
    product_cast                      varchar(200)  null,
    p_pack_short         text          null,
    so_status                         varchar(200)  null,
    p_quantity                        float         null,
    p_foc_qty                         float         null,
    p_mrp                             float         null,
    p_billing_rate                    float         null,
    comments                          text          null,
    tax_percent                       float         null,
    product_extra_charges             float         null,
    product_extra_charges_tax_percent float         null,
    constraint id
        unique (id)
);


"""

class QuotationProducts(BaseModel):
    sales_order_approval_id: int
    product_name: str
    composition: str
    dosage_name: str
    product_cast: str
    p_pack_short: str
    so_status: str
    p_quantity: float
    p_foc_qty: Optional[float] = None
    p_mrp: Optional[float] = None
    p_billing_rate: float
    comments: str
    tax_percent: float
    product_extra_charges: float
    product_extra_charges_tax_percent: float

class SaveSalesOrderApprovalQuotation(BaseModel):
    company_name: str
    quotation_number: str
    quotation_date: str
    customer_name: str
    customer_contact_person: str
    customer_mobile_number: str
    customer_email: str
    advance_percentage: float
    charges: List[dict]
    total_amount: float
    advance_amount: float
    prev_copy_quotation_id: int
    products: List[QuotationProducts]

@router.post('/create-sales-order-approval-quotation', tags=["SO Approval"], description="")
async def create_sales_order_approval_quotation(
        data: SaveSalesOrderApprovalQuotation,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        token_data = verify_token(request.headers.get("Authorization", ""))
        user_id = token_data.get("user_id")
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            INSERT INTO sales_order_approval_quotation (
                created_time,
                created_by,
                is_deleted,
                company_name,
                quotation_number,
                quotation_date,
                customer_name,
                customer_contact_person,
                customer_mobile_number,
                customer_email,
                advance_percentage,
                charges,
                total_amount,
                advance_amount,
                prev_copy_quotation_id
            ) VALUES (
                '{current_time}',
                {user_id},
                0,
                '{data.company_name}',
                '{data.quotation_number}',
                '{data.quotation_date}',
                '{data.customer_name}',
                '{data.customer_contact_person}',
                '{data.customer_mobile_number}',
                '{data.customer_email}',
                {data.advance_percentage},
                '{json.dumps(data.charges)}',
                {data.total_amount},
                {data.advance_amount},
                {data.prev_copy_quotation_id}
            )
        """)
        rdb.commit()

        cursor.execute(f"""
            SELECT quotation_id FROM sales_order_approval_quotation ORDER BY quotation_id DESC LIMIT 1
        """)
        result = cursor.fetchall()

        quotation_id = result[0]["quotation_id"]

        for product in data.products:
            cursor.execute(f"""
                INSERT INTO sales_order_approval_quotation_products (
                    quotation_id,
                    sales_order_approval_id,
                    is_deleted,
                    product_name,
                    composition,
                    dosage_name,
                    product_cast,
                    p_pack_short,
                    so_status,
                    p_quantity,
                    p_foc_qty,
                    p_mrp,
                    p_billing_rate,
                    comments,
                    tax_percent,
                    product_extra_charges,
                    product_extra_charges_tax_percent
                ) VALUES (
                    {quotation_id},
                    {product.sales_order_approval_id},
                    0,
                    '{product.product_name}',
                    '{product.composition}',
                    '{product.dosage_name}',
                    '{product.product_cast}',
                    '{product.p_pack_short}',
                    '{product.so_status}',
                    {product.p_quantity},
                    {product.p_foc_qty if product.p_foc_qty else 'NULL'},
                    {product.p_mrp if product.p_mrp else 'NULL'},
                    {product.p_billing_rate},
                    '{product.comments}',
                    {product.tax_percent},
                    {product.product_extra_charges},
                    {product.product_extra_charges_tax_percent}
                )
            """)
            rdb.commit()

        return {"message": "Quotation created successfully!", "quotation_id": quotation_id}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"Error creating quotation! {e}")

@router.get('/get-sales-order-approval-quotation-by-id', tags=["SO Approval"], description="")
async def get_sales_order_approval_quotation_by_id(
        quotation_id: int,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        print("query", query)
        query = f"""
            SELECT * FROM sales_order_approval_quotation WHERE quotation_id = {str(quotation_id)}
        """
        cursor.execute(query)
        print("hii")
        result = cursor.fetchall()

        print("result", result)

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"Quotation not found!")

        quotation = result[0]
        # quotation["charges"] = json.loads(quotation["charges"])
        print("charges", quotation)

        cursor.execute(f"""
            SELECT * FROM sales_order_approval_quotation_products WHERE quotation_id = {quotation_id}
        """)
        result = cursor.fetchall()

        quotation["products"] = result

        return {"data": quotation}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"Error creating quotation! {e}")


@router.get('/get-related-quotations-by-so-approval-id', tags=["SO Approval"], description="")
async def get_related_quotations_by_so_approval_id(
        sales_order_approval_id: int,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # get all the quotations which have sales_order_approval_id in the sales_order_approval_quotation_products table
        cursor.execute(f"""
            SELECT
                u.username as created_by_username,
                soaq.created_time,
                soaq.quotation_id,
                soaq.quotation_number,
                soaq.quotation_date,
                soaq.customer_name,
                soaq.total_amount,
                soaq.advance_amount
            FROM sales_order_approval_quotation soaq
                LEFT JOIN users u ON u.srno = soaq.created_by
            WHERE
            soaq.quotation_id IN (SELECT distinct quotation_id FROM sales_order_approval_quotation_products WHERE sales_order_approval_id = {sales_order_approval_id})
            ORDER BY soaq.created_time DESC
         """)
        result = cursor.fetchall()

        return {"data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"Error creating quotation! {e}")

class AllQuotationsTable(BaseModel):
    from_time: str
    to_time: str
    created_by: Optional[List[int]] = []
    customer_name: Optional[str] = ""
    company_name: Optional[str] = "ANY"

@router.post('/get-all-quotations', tags=["SO Approval"], description="")
async def get_all_quotations(
        clause: AllQuotationsTable,
        request: Request,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        where_clause = ""
        if len(clause.created_by) > 0:
            where_clause += f" AND soaq.created_by IN ({', '.join([str(i) for i in clause.created_by])})"
        if clause.customer_name != "":
            where_clause += f" AND soaq.customer_name LIKE '%{clause.customer_name}%'"
        if clause.from_time != "" and clause.to_time != "":
            where_clause += f" AND soaq.created_time BETWEEN '{clause.from_time}' AND '{clause.to_time}'"
        if clause.company_name != "ANY":
            where_clause += f" AND soaq.company_name = '{clause.company_name}'"

        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            SELECT
                u.username as created_by_username,
                soaq.company_name,
                soaq.created_time,
                soaq.quotation_id,
                soaq.quotation_number,
                soaq.quotation_date,
                soaq.customer_name,
                soaq.total_amount,
                soaq.advance_amount
            FROM sales_order_approval_quotation soaq
                LEFT JOIN users u ON u.srno = soaq.created_by
            WHERE 1 = 1 {where_clause}
            ORDER BY soaq.created_time DESC
         """)
        result = cursor.fetchall()

        return {"data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"Error creating quotation! {e}")


"""
create table cianerp_16_17.sales_order_approval_performa_invoice
(
    performa_invoice_id int auto_increment primary key,
    created_time timestamp null,
    created_by int null,
    is_deleted int default 0 null,
    exporter_name varchar(200) null,
    manufacturer_name varchar(200) null,
    consignee_name varchar(400) null,
    consignee_contact_details varchar(400) null,
    consignee_address text null,
    performa_invoice_number varchar(40) null,
    performa_invoice_date date null,
    exporters_reference_number varchar(200) null,
    other_references varchar(400) null,
    other_buyer_name varchar(400) null,
    country_of_origin varchar(60) null,
    country_of_final_destination varchar(60) null,
    prepration varchar(200) null,
    port_of_discharge varchar(400) null,
    place_of_receipt_by_pre_carrier varchar(200) null,
    final_destination varchar(200) null,
    terms_of_delivery varchar(400) null,
    payment_terms varchar(400) null,
    shipment_mode varchar(60) null,
    port_of_loading varchar(60) null,
    additionalCharges text null,
    total_amount float null,
    previous_performa_invoice_id int default 0 null,
    constraint performa_invoice_id unique (performa_invoice_id)
);

create table cianerp_16_17.sales_order_approval_performa_invoice_products
(
    id int auto_increment primary key,
    performa_invoice_id int null,
    sales_order_approval_id int null,
    is_deleted int default 0 null,
    product_name varchar(200) null,
    composition text null,
    dosage_name varchar(200) null,
    product_cast varchar(200) null,
    p_pack_short text null,
    p_quantity float null,
    p_foc_qty float null,
    p_billing_rate float null,
    constraint id unique (id)
);

create index so_approval_performa_invoice_products_performa_invoice_id_index
    on cianerp_16_17.sales_order_approval_performa_invoice_products (performa_invoice_id);

create index so_approval_pi_products_sales_order_approval_id_index
    on cianerp_16_17.sales_order_approval_performa_invoice_products (sales_order_approval_id);
"""

class PerformaInvoiceProducts(BaseModel):
    sales_order_approval_id: int
    product_name: str
    composition: str
    dosage_name: str
    product_cast: str
    p_pack_short: str
    p_quantity: float
    p_foc_qty: Optional[float] = None
    p_billing_rate: float

class SavePerformaInvoice(BaseModel):
    exporter_name: str
    manufacturer_name: str
    consignee_name: str
    consignee_contact_details: str
    consignee_address: str
    # performa_invoice_number: str
    performa_invoice_date: str
    exporters_reference_number: str
    other_references: str
    other_buyer_name: str
    country_of_origin: str
    country_of_final_destination: str
    prepration: str
    port_of_discharge: str
    place_of_receipt_by_pre_carrier: str
    final_destination: str
    terms_of_delivery: str
    payment_terms: str
    shipment_mode: str
    port_of_loading: str
    additionalCharges: List[dict]
    total_amount: float
    previous_performa_invoice_id: int
    products: List[PerformaInvoiceProducts]

@router.post('/create-performa-invoice', tags=["SO Approval"], description="")
async def create_performa_invoice(
        data: SavePerformaInvoice,
        request: Request,
        db = Depends(get_db),
        rdb = Depends(get_raw_db)
):
    try:
        token_data = verify_token(request.headers.get("Authorization", ""))
        user_id = token_data.get("user_id")
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cursor.execute(f"""
            SELECT COALESCE(MAX(performa_invoice_id), 0) AS latest_id FROM sales_order_approval_performa_invoice
        """)
        result = cursor.fetchall()
        curr_piv_id = result[0]["latest_id"] + 1
        current_date = datetime.now().strftime("%y%m")
        invoice_number = f"PIV-{current_date}-{curr_piv_id:04d}"

        cursor.execute(f"""
            INSERT INTO sales_order_approval_performa_invoice (
                created_time,
                created_by,
                is_deleted,
                exporter_name,
                manufacturer_name,
                consignee_name,
                consignee_contact_details,
                consignee_address,
                performa_invoice_number,
                performa_invoice_date,
                exporters_reference_number,
                other_references,
                other_buyer_name,
                country_of_origin,
                country_of_final_destination,
                prepration,
                port_of_discharge,
                place_of_receipt_by_pre_carrier,
                final_destination,
                terms_of_delivery,
                payment_terms,
                shipment_mode,
                port_of_loading,
                additionalCharges,
                total_amount,
                previous_performa_invoice_id
            ) VALUES (
                '{current_time}',
                {user_id},
                0,
                '{data.exporter_name}',
                '{data.manufacturer_name}',
                '{data.consignee_name}',
                '{data.consignee_contact_details}',
                '{data.consignee_address}',
                '{invoice_number}',
                '{data.performa_invoice_date}',
                '{data.exporters_reference_number}',
                '{data.other_references}',
                '{data.other_buyer_name}',
                '{data.country_of_origin}',
                '{data.country_of_final_destination}',
                '{data.prepration}',
                '{data.port_of_discharge}',
                '{data.place_of_receipt_by_pre_carrier}',
                '{data.final_destination}',
                '{data.terms_of_delivery}',
                '{data.payment_terms}',
                '{data.shipment_mode}',
                '{data.port_of_loading}',
                '{json.dumps(data.additionalCharges)}',
                {data.total_amount},
                {data.previous_performa_invoice_id}
            )
        """)
        rdb.commit()

        cursor.execute(f"""
            SELECT COALESCE(MAX(performa_invoice_id), 0) AS latest_id FROM sales_order_approval_performa_invoice
        """)
        result = cursor.fetchall()
        performa_invoice_id = result[0]["latest_id"]

        for product in data.products:
            cursor.execute(f"""
                INSERT INTO sales_order_approval_performa_invoice_products (
                    performa_invoice_id,
                    sales_order_approval_id,
                    is_deleted,
                    product_name,
                    composition,
                    dosage_name,
                    product_cast,
                    p_pack_short,
                    p_quantity,
                    p_foc_qty,
                    p_billing_rate
                ) VALUES (
                    {performa_invoice_id},
                    {product.sales_order_approval_id},
                    0,
                    '{product.product_name}',
                    '{product.composition}',
                    '{product.dosage_name}',
                    '{product.product_cast}',
                    '{product.p_pack_short}',
                    {product.p_quantity},
                    {product.p_foc_qty if product.p_foc_qty is not None else 'NULL'},
                    {product.p_billing_rate}
                )
            """)
            rdb.commit()

        return {"message": "Performa invoice created successfully!", "performa_invoice_id": performa_invoice_id}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"Error creating performa invoice! {e}")

@router.get('/get-sales-order-approval-performa-invoice-by-id', tags=["SO Approval"], description="")
async def get_sales_order_approval_performa_invoice_by_id(
        performa_invoice_id: int,
        request: Request,
        db = Depends(get_db),
        rdb = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            SELECT * FROM sales_order_approval_performa_invoice WHERE performa_invoice_id = {performa_invoice_id}
        """)
        result = cursor.fetchall()

        if len(result) == 0:
            raise HTTPException(status_code=404, detail=f"Performa invoice not found!")

        invoice = result[0]
        invoice["additionalCharges"] = json.loads(invoice["additionalCharges"])

        cursor.execute(f"""
            SELECT * FROM sales_order_approval_performa_invoice_products WHERE performa_invoice_id = {performa_invoice_id}
        """)
        result = cursor.fetchall()

        invoice["products"] = result

        return {"data": invoice}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving performa invoice! {e}")

@router.get('/get-related-performa-invoices-by-so-approval-id', tags=["SO Approval"], description="")
async def get_related_performa_invoices_by_so_approval_id(
        sales_order_approval_id: int,
        request: Request,
        db = Depends(get_db),
        rdb = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # get all the performa invoices associated with the given sales_order_approval_id
        cursor.execute(f"""
            SELECT
                u.username as created_by_username,
                soai.created_time,
                soai.performa_invoice_id,
                soai.performa_invoice_number,
                soai.performa_invoice_date,
                soai.consignee_name,
                soai.total_amount
            FROM sales_order_approval_performa_invoice soai
                LEFT JOIN users u ON u.srno = soai.created_by
            WHERE
            soai.performa_invoice_id IN (
                SELECT distinct performa_invoice_id FROM sales_order_approval_performa_invoice_products WHERE sales_order_approval_id = {sales_order_approval_id}
            )
            ORDER BY soai.created_time DESC
         """)
        result = cursor.fetchall()

        return {"data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving performa invoices! {e}")

class AllPerformaInvoicesTable(BaseModel):
    from_time: str
    to_time: str
    created_by: Optional[List[int]] = []
    consignee_name: Optional[str] = ""
    exporter_name: Optional[str] = "ANY"

@router.post('/get-all-performa-invoices', tags=["SO Approval"], description="")
async def get_all_performa_invoices(
        clause: AllPerformaInvoicesTable,
        request: Request,
        db = Depends(get_db),
        rdb = Depends(get_raw_db)
):
    try:
        where_clause = ""
        if len(clause.created_by) > 0:
            where_clause += f" AND soai.created_by IN ({', '.join([str(i) for i in clause.created_by])})"
        if clause.consignee_name != "":
            where_clause += f" AND soai.consignee_name LIKE '%{clause.consignee_name}%'"
        if clause.from_time != "" and clause.to_time != "":
            where_clause += f" AND soai.created_time BETWEEN '{clause.from_time}' AND '{clause.to_time}'"
        if clause.exporter_name != "ANY":
            where_clause += f" AND soai.exporter_name = '{clause.exporter_name}'"

        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(f"""
            SELECT
                u.username as created_by_username,
                soai.exporter_name,
                soai.created_time,
                soai.performa_invoice_id,
                soai.performa_invoice_number,
                soai.performa_invoice_date,
                soai.consignee_name,
                soai.total_amount
            FROM sales_order_approval_performa_invoice soai
                LEFT JOIN users u ON u.srno = soai.created_by
            WHERE 1 = 1 {where_clause}
            ORDER BY soai.created_time DESC
         """)
        result = cursor.fetchall()

        return {"data": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.debug(f"{e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving performa invoices! {e}")

