/**
 * 개인정보 수정 페이지
 * 
 * @description 로그인한 사용자의 개인정보 수정
 * @route /account-settings/profile
 * @access 로그인 필수
 */

"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"
import { formatFullPhoneNumber, formatTime, handleAddressSearch } from "@/lib/utils"
import { onAuthStateChanged } from "firebase/auth"
import { getUserProfile, saveUserProfile } from "@/lib/data-storage"
import Link from "next/link"

export default function ProfileEditPage() {
  const router = useRouter()
  const [emailStep, setEmailStep] = useState<"initial" | "editing" | "verify">("initial")
  const [verificationCode, setVerificationCode] = useState("")
  const [timer, setTimer] = useState(180) // 3 minutes
  const [newEmail, setNewEmail] = useState("") 
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [detailAddress, setDetailAddress] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isResending, setIsResending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [fullEmail, setFullEmail] = useState("")
  
  // 필드별 오류 상태
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    verificationCode: ""
  })

  // 커스텀 토스트 상태
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastSubMessage, setToastSubMessage] = useState("")

  // 필드 오류 설정 함수
  const setFieldError = (field: keyof typeof fieldErrors, message: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: message }))
  }

  // 필드 오류 초기화 함수
  const clearFieldError = (field: keyof typeof fieldErrors) => {
    setFieldErrors(prev => ({ ...prev, [field]: "" }))
  }

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    if (!email) {
      setFieldError("email", "이메일을 입력해주세요.")
      return false
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setFieldError("email", "이메일 주소 형식에 맞게 입력해 주세요.")
      return false
    }
    
    // 기존 이메일과 동일한지 확인
    if (email === currentUser?.email) {
      setFieldError("email", "현재 이메일과 동일합니다. 다른 이메일을 입력해주세요.")
      return false
    }
    
    clearFieldError("email")
    return true
  }

  const isValidEmail = fullEmail.length > 0 && !fieldErrors.email
  const isEmailChanged = fullEmail !== currentUser?.email

  // 타이머 관리
  useEffect(() => {
    if (emailStep === "verify" && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [emailStep, timer])

  // Firebase Auth 상태 확인 및 개인정보 로드
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        setIsLoading(true)
        
        try {
          // Firebase에서 개인정보 조회
          const userProfile = await getUserProfile(user)
          
          if (userProfile) {
            try {
              
              // 개인정보 설정
              setName(userProfile.name || "")
              setFullEmail(userProfile.email)
              const phone = userProfile.phone || ""
              setPhone(formatFullPhoneNumber(phone))
              setAddress(userProfile.address || "")
              setDetailAddress(userProfile.detailAddress || "")
              setZipCode(userProfile.zipCode || "")
            } catch (error) {
              console.error('개인정보 조회 실패:', error)
            }
          }
        } catch (error) {
          console.error('개인정보 로드 실패:', error)
          setToastMessage("데이터 로드 실패")
          setToastSubMessage("개인정보를 불러오는 중 오류가 발생했습니다.")
          setShowToast(true)
          setTimeout(() => setShowToast(false), 3000)
        } finally {
          setIsLoading(false)
        }
      } else {
        // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
        router.push('/')
      }
    })

    return () => unsubscribe()
  }, [router])

  // 이메일 변경 클릭
  const handleEmailChange = () => {
    if (emailStep === "initial") {
      setEmailStep("editing")
      // 현재 표시된 이메일을 fullEmail에 설정
      const currentEmail = newEmail || fullEmail || ""
      setFullEmail(currentEmail)
    }
  }

  // 이메일 인증 클릭 
  const handleEmailVerification = async () => {
    if (emailStep === "editing") {
      // 이메일 유효성 검사
      if (!validateEmail(fullEmail)) {
        return
      }
      
      try {
        // 인증코드 전송 API 호출
        const response = await fetch('/api/send-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: fullEmail }),
        })
        
        const data = await response.json()
        
        if (response.ok) {
          setEmailStep("verify")
          setTimer(180) // 3분 타이머 시작
          setToastMessage("인증코드가 전송되었습니다.")
          setToastSubMessage("이메일을 확인해주세요.")
          setShowToast(true)
          setTimeout(() => setShowToast(false), 3000)
        } else {
          setToastMessage(data.error || "인증코드 전송에 실패했습니다.")
          setToastSubMessage("다시 시도해주세요.")
          setShowToast(true)
          setTimeout(() => setShowToast(false), 3000)
        }
      } catch (error) {
        console.error('인증코드 전송 오류:', error)
        setToastMessage("인증코드 전송 중 오류가 발생했습니다.")
        setToastSubMessage("다시 시도해주세요.")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } else if (emailStep === "verify") {
      // 인증코드 확인
      if (verificationCode.length !== 6) {
        setFieldError("verificationCode", "인증코드 6자리를 입력해주세요.")
        return
      }
      
      setIsVerifying(true)
      
      try {
        const response = await fetch('/api/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: fullEmail, 
            code: verificationCode 
          }),
        })
        
        const data = await response.json()
        
        if (response.ok) {
          // 인증 성공 - 바뀐 이메일을 상태에 저장
          setNewEmail(fullEmail)
          
          // 초기 상태로 돌아가기 (바뀐 이메일로)
          setEmailStep("initial")
          setVerificationCode("")
          setFullEmail("")
          clearFieldError("email")
          clearFieldError("verificationCode")
        } else {
          setFieldError("verificationCode", data.error || "인증코드가 올바르지 않습니다.")
        }
      } catch (error) {
        console.error('인증코드 확인 오류:', error)
        setFieldError("verificationCode", "인증코드 확인 중 오류가 발생했습니다.")
      } finally {
        setIsVerifying(false)
      }
    }
  }

  // 인증코드 재전송 
  const handleResendCode = async () => {
    setIsResending(true)
    
    try {
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: fullEmail }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setTimer(180) // 타이머 리셋
        setToastMessage("인증코드가 재전송되었습니다.")
        setToastSubMessage("이메일을 확인해주세요.")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } else {
        setToastMessage(data.error || "인증코드 재전송에 실패했습니다.")
        setToastSubMessage("다시 시도해주세요.")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (error) {
      console.error('인증코드 재전송 오류:', error)
      setToastMessage("인증코드 재전송 중 오류가 발생했습니다.")
      setToastSubMessage("다시 시도해주세요.")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setIsResending(false)
    }
  }

  // 완료버튼 클릭하여 개인정보 저장
  const handleSaveProfile = async () => {
    try {
      if (currentUser) {
        
        // 포맷팅된 데이터를 원래 형태로 변환
        const cleanPhone = phone.replace(/\D/g, '') // 숫자만 추출
        
        const profileData = {
          name,
          phone: cleanPhone,
          address,
          detailAddress,
          zipCode,
          email: newEmail || fullEmail
        }
        
        // Firebase에 개인정보 저장
        const saved = await saveUserProfile(currentUser, profileData)
        
        if (!saved) {
          throw new Error('개인정보 저장 실패')
        }
      }
      router.push('/dashboard')
    } catch (error) {
      console.error('프로필 저장 실패:', error)
      setToastMessage("저장 실패")
      setToastSubMessage("프로필 저장 중 오류가 발생했습니다.")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Daum 우편번호 API 스크립트 로드 */}
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Daum 우편번호 API 로드 완료');
        }}
      />
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
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

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 수정 시 주의사항 콜아웃 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  수정 시 주의사항
                </h3>
              </div>
            </div>
          </div>
          <div className="text-sm text-yellow-700 mt-2 ml-8">
            <p>이미 동의한 정보제공 내역과 달라질 수 있습니다.</p>
            <p>진행 중인 서비스가 있다면 수정에 주의하시기 바랍니다.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>개인정보 수정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">개인정보를 불러오는 중...</div>
              </div>
            ) : (
              <>
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input 
                id="name" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                이메일<span className="text-red-500">*</span>
              </Label>

              <div className="space-y-3">
                {emailStep === "initial" && (
                  <>
                    <div className="bg-muted rounded-md px-3 py-2 text-sm text-muted-foreground">
                    {newEmail || fullEmail}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={handleEmailChange}
                    >
                      이메일 변경하기
                    </Button>
                  </>
                )}

                {emailStep === "editing" && (
                  <div className="space-y-3">
                    <Input
                      value={fullEmail}
                      onChange={(e) => {
                        const emailValue = e.target.value
                        setFullEmail(emailValue)
                        // 실시간 유효성 검사
                        if (emailValue) {
                          validateEmail(emailValue)
                        }
                      }}
                      onBlur={() => validateEmail(fullEmail)}
                      placeholder="이메일을 입력하세요"
                      className={`w-full ${
                        fieldErrors.email 
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                          : "focus:border-primary focus:ring-primary"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-red-600">{fieldErrors.email}</p>
                    )}
                    <Button
                      variant="outline"
                      className={`w-full ${
                        isValidEmail && isEmailChanged
                          ? "bg-primary text-white hover:bg-primary/90" 
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      onClick={handleEmailVerification}
                      disabled={!isValidEmail || !isEmailChanged}
                    >
                      이메일 인증하기
                    </Button>
                  </div>
                )}

                {emailStep === "verify" && (
                  <div className="space-y-3">
                    <div className="bg-muted rounded-md px-3 py-2 text-sm text-muted-foreground">
                      {fullEmail}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setEmailStep("editing")
                        setVerificationCode("")
                        clearFieldError("verificationCode")
                      }}
                    >
                      이메일 변경하기
                    </Button>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <p className="text-sm text-muted-foreground">이메일로 받은 인증코드를 입력해주세요.</p>
                      <div className="relative">
                        <Input
                          placeholder="인증코드 6자리"
                          value={verificationCode}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '') // 숫자만 허용
                            if (value.length <= 6) {
                              setVerificationCode(value)
                              if (fieldErrors.verificationCode) {
                                clearFieldError("verificationCode")
                              }
                            }
                          }}
                          maxLength={6}
                          className={`pr-24 bg-white ${
                            fieldErrors.verificationCode 
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                              : "focus:border-primary focus:ring-primary"
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                          <span className="text-red-500 text-sm font-mono">{formatTime(timer)}</span>
                          <button
                            onClick={handleEmailVerification}
                            disabled={verificationCode.length !== 6 || isVerifying}
                            className={`text-sm font-medium ${
                              verificationCode.length === 6 && !isVerifying
                                ? "text-primary hover:text-primary/80" 
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            확인
                          </button>
                        </div>
                      </div>
                      {fieldErrors.verificationCode && (
                        <p className="text-sm text-red-600">{fieldErrors.verificationCode}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        이메일을 받지 못하셨나요? 
                        <button 
                          onClick={handleResendCode}
                          disabled={isResending}
                          className="text-primary hover:underline ml-1"
                        >
                          {isResending ? "재전송 중..." : "이메일 재전송하기"}
                        </button>
                      </p>
                    </div>
                  </div>
                )}


              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">휴대폰 번호</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={phone}
                onChange={(e) => {
                  const formattedPhone = formatFullPhoneNumber(e.target.value)
                  setPhone(formattedPhone)
                }}
                maxLength={13}
              />
            </div>

            <div className="space-y-2">
              <Label>주소</Label>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={zipCode}
                    placeholder="우편번호"
                    className="flex-1 focus:border-primary focus:ring-primary bg-muted"
                    disabled
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    className="bg-primary text-white hover:bg-primary/90"
                    onClick={() => handleAddressSearch(setZipCode, setAddress)}
                  >
                    주소찾기
                  </Button>
                </div>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="주소"
                  className="focus:border-primary focus:ring-primary bg-muted"
                  disabled
                />
                <Input
                  type="text"
                  placeholder="상세주소 입력"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  className="focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="pt-4">
              <Link href="/account-settings/delete" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
                탈퇴하기 <span className="ml-1">&gt;</span>
              </Link>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
              onClick={handleSaveProfile}
            >
              완료
            </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg">
            <div className="text-center">
              <p className="text-sm font-medium">{toastMessage}</p>
              {toastSubMessage && (
                <p className="text-xs mt-1 text-gray-300">{toastSubMessage}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
