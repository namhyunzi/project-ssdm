"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function StorageGuidePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => {
            router.back()
          }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <button 
            onClick={() => {
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
            <CardTitle className="text-center text-xl">데이터 분산 저장이 무엇인가요?</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed text-center">
                데이터를 여러 곳에 나누어 암호화해 저장하는 보안 기술로, 개인정보를 더욱 안전하게 보호합니다.<br />
                분산 저장을 사용하면 한 곳이 침해되더라도 전체 데이터가 노출되지 않습니다.
              </p>
              
              <div className="space-y-3">
                <h3 className="text-base font-medium text-gray-900">분산 저장으로 보호되는 주요 개인정보</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    주민등록번호
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    휴대폰 번호
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    여권번호
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    신용카드 번호
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    계좌번호
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    주소
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    운전면허증 번호
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">보안 안내</p>
                    <p className="text-muted-foreground mt-1">
                    데이터는 강력한 암호화 방식으로 처리되며, 여러 저장소에 나누어 저장될수록<br />
                    회사는 어떠한 경우에도 원본 데이터를 직접 열람할 수 없습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 확인 버튼 */}
            <Button 
              onClick={() => router.back()}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base font-medium"
            >
              확인
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
