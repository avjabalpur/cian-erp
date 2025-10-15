import { LocationTypeManagement } from "@/modules/masters/location-types";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Location Type Management",
  description: "Manage location types and categories",
}

export default function LocationTypesPage() {
  return <LocationTypeManagement />;
}

