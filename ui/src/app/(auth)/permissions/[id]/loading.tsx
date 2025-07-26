import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function UserDetailsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-[50px]" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-6 w-[80px] rounded-full" />
          </div>
          <Skeleton className="h-4 w-[200px] mt-1" />
        </div>
        <Skeleton className="h-9 w-[120px]" />
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="border-b">
          <div className="flex h-10 items-center gap-4 px-4">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </div>

        {/* Overview Tab */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {Array(3).fill(null).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                ))}
              </div>
              <div className="h-px bg-border" />
              <div className="space-y-3">
                {Array(3).fill(null).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-[180px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <Skeleton className="h-4 w-4 mt-1" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[160px]" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array(2).fill(null).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contacts Tab (Hidden) */}
        <div className="hidden grid gap-4 md:grid-cols-2">
          {Array(4).fill(null).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-[150px]" />
                  <Skeleton className="h-5 w-[80px] rounded-full" />
                </div>
                <Skeleton className="h-4 w-[120px]" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array(2).fill(null).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-[180px]" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Notes Tab (Hidden) */}
        <div className="hidden space-y-4">
          {Array(3).fill(null).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-[120px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
