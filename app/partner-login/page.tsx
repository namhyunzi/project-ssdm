"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function PartnerLoginPage() {
  const [partnerId, setPartnerId] = useState("")
  const [partnerPassword, setPartnerPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success")
  const router = useRouter()

  // 토스트 표시 함수
  const showToastMessage = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handlePartnerLogin = async () => {
    if (!partnerId || !partnerPassword) {
      showToastMessage("파트너 ID와 비밀번호를 입력해주세요.", "error")
      return
    }

    setIsLoading(true)
    
    try {
      // 파트너 로그인 로직 (실제 구현 필요)
      console.log('파트너 로그인 시도:', { partnerId, partnerPassword })
      
      // 임시 성공 처리
      showToastMessage("파트너 로그인 성공!", "success")
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
      
    } catch (error) {
      console.error('파트너 로그인 오류:', error)
      showToastMessage("로그인에 실패했습니다. 파트너 ID와 비밀번호를 확인해주세요.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold" style={{ color: "#1e3a8a" }}>SSDM</h1>
              <p className="text-sm text-muted-foreground">
                파트너사 로그인
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Input 
                type="text" 
                placeholder="파트너 ID" 
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full"
                style={{ "--tw-ring-color": "#1e3a8a" } as React.CSSProperties}
                disabled={isLoading}
              />
              <Input 
                type="password" 
                placeholder="비밀번호" 
                value={partnerPassword}
                onChange={(e) => setPartnerPassword(e.target.value)}
                className="w-full"
                style={{ "--tw-ring-color": "#1e3a8a" } as React.CSSProperties}
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePartnerLogin()
                  }
                }}
              />
              <Button 
                className="w-full text-white hover:opacity-90"
                style={{ backgroundColor: "#1e3a8a" }}
                onClick={handlePartnerLogin}
                disabled={isLoading || !partnerId || !partnerPassword}
              >
                {isLoading ? "로그인 중..." : "파트너 로그인"}
              </Button>
            </div>

            {/* 파트너 신청 버튼 */}
            <Button 
              variant="outline" 
              className="w-full hover:bg-blue-50"
              style={{ borderColor: "#1e3a8a", color: "#1e3a8a" } as React.CSSProperties}
              onClick={() => {
                router.push('/partner-apply')
              }}
            >
              SSDM 파트너 신청
            </Button>

          </CardContent>
        </Card>
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-6 py-4 rounded-lg shadow-lg ${
            toastType === "success" ? "bg-green-600 text-white" :
            toastType === "error" ? "bg-red-600 text-white" :
            "bg-gray-800 text-white"
          }`}>
            <div className="text-center">
              <p className="text-sm font-medium">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
