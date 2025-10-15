"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function LoginCompletePage() {
  const handleClose = () => {
    // 팝업 닫기 또는 부모 창으로 돌아가기
    if (window.opener) {
      // 팝업에서 열린 경우
      window.close()
    } else {
      // 일반 페이지인 경우
      window.history.back()
    }
  }

  const handleConfirm = () => {
    // 로그인 완료 확인 후 부모 창에 정보 전달
    if (window.opener) {
      // 팝업에서 열린 경우 - 부모 창에 로그인 완료 정보 전달
      window.opener.postMessage({
        type: 'SSDM_LOGIN_COMPLETE',
        userId: 'user_id_here', // 실제 사용자 ID
        timestamp: new Date().toISOString()
      }, '*')
      window.close()
    } else {
      // 일반 페이지인 경우
      console.log('로그인 완료 확인')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-xl">SSDM 로그인 완료</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            SSDM에 성공적으로 로그인되었습니다
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 로그인 정보 */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-green-800 font-medium">
                개인정보가 안전하게 보호됩니다
              </p>
              <p className="text-xs text-green-600 mt-1">
                SSDM의 분산 저장 기술로 최고 수준의 보안을 제공합니다
              </p>
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleClose}
            >
              닫기
            </Button>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleConfirm}
            >
              확인
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
