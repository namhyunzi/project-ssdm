"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import Link from "next/link"

export default function StorageDistributedPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedOption, setSelectedOption] = useState("db1")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success")

  // 토스트 표시 함수
  const showToastMessage = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Firebase Auth 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        //router.push('/')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleComplete = async () => {
    try {
      // 분산 저장소 설정 저장 로직
      console.log('선택된 옵션:', selectedOption)
      
      showToastMessage("분산 저장소 설정이 완료되었습니다!", "success")
      
      // 1초 후 다음 페이지로 이동
      setTimeout(() => {
        const jwtToken = sessionStorage.getItem('openPopup')
        
        if (jwtToken) {
          // 팝업에서 온 경우 - /consent로 이동
          router.push('/consent')
        } else {
          // 일반 접근 - /dashboard로 이동
          router.push('/dashboard')
        }
      }, 1000)
      
    } catch (error) {
      console.error('분산 저장소 설정 오류:', error)
      showToastMessage("설정 중 오류가 발생했습니다.", "error")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => {
            router.push('/storage-setup')
          }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <button 
            onClick={() => {
              // 임시 세션 삭제
              sessionStorage.removeItem('temp_profile_data')
              router.push('/dashboard')
            }}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="text-center">
              <h1 className="text-lg font-bold text-primary">SSDM</h1>
              <p className="text-xs text-muted-foreground">개인정보보호</p>
            </div>
          </button>
          <div className="w-16"></div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">분산 저장 수준 선택</CardTitle>
            <p className="text-center text-sm text-muted-foreground">데이터를 여러 곳에 분산하여 안전하게 보관하세요</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
                {/* DB 1개 옵션 */}
                <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="db1" id="db1" className="text-primary" />
                  <Label htmlFor="db1" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">단일 저장소</p>
                        <p className="text-sm text-muted-foreground">한 곳에만 저장됩니다. 빠르고 간단합니다.</p>
                      </div>
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">보통</span>
                    </div>
                  </Label>
                </div>

                {/* DB 2개 옵션 */}
                <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="db2" id="db2" className="text-primary" />
                  <Label htmlFor="db2" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">이중 저장소</p>
                        <p className="text-sm text-muted-foreground">두 곳에 분산 저장됩니다. 안전성이 향상됩니다.</p>
                      </div>
                      <span className="text-sm text-emerald-700 bg-emerald-100 px-3 py-1 rounded">약간 높음</span>
                    </div>
                  </Label>
                </div>

                {/* DB 3개 옵션 */}
                <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="db3" id="db3" className="text-primary" />
                  <Label htmlFor="db3" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">삼중 저장소</p>
                        <p className="text-sm text-muted-foreground">세 곳에 분산 저장됩니다. 최고 수준의 보안을 제공합니다.</p>
                      </div>
                      <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded">매우 높음</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

            {/* 설명 텍스트 */}
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">
                소중한 데이터를 여러 저장소에 나누어 저장하면<br />
                유출 위험을 줄이고 보안을 강화할 수 있습니다.
              </p>
              <Link href="/storage-guide" className="text-primary text-sm hover:underline">
                데이터 분산 저장이란?
              </Link>
            </div>

            {/* 버튼 그룹 */}
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => router.push('/storage-setup')}
                className="flex-1 py-3 text-base font-medium"
              >
                이전
              </Button>
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 text-base font-medium"
              >
                설정 완료
              </Button>
            </div>
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
