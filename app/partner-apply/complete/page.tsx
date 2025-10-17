"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PartnerApplyCompletePage() {
  const router = useRouter()

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold" style={{ color: "#1e3a8a" }}>SSDM</h1>
            <p className="text-xs text-muted-foreground">파트너 신청 완료</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg 
                    className="w-10 h-10 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>

                {/* Success Message */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    파트너사 신청이 완료되었습니다.
                  </h2>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>승인까지 최대 3일 정도 소요될 수 있습니다.</p>
                    <p>결과는 입력하신 이메일로 발송됩니다.</p>
                  </div>
                </div>

                {/* Home Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleGoHome}
                    className="w-full text-white py-3 text-base font-medium"
                    style={{ backgroundColor: "#1e3a8a" }}
                  >
                    홈으로 가기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
