"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function PartnerApplyPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success")

  // 회사 정보
  const [companyName, setCompanyName] = useState("")
  const [businessNumber, setBusinessNumber] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")
  const [productType, setProductType] = useState("")
  const [pricingPlan, setPricingPlan] = useState("")

  // 계정 정보 (회원가입 형태)
  const [emailUsername, setEmailUsername] = useState("")
  const [emailDomain, setEmailDomain] = useState("")
  const [isDomainInputMode, setIsDomainInputMode] = useState(false)
  const [customDomain, setCustomDomain] = useState("")
  const [emailVerificationStep, setEmailVerificationStep] = useState<"initial" | "code-sent" | "verified">("initial")
  const [verificationCode, setVerificationCode] = useState("")
  const [timer, setTimer] = useState(180)
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  // 필드별 오류 상태
  const [fieldErrors, setFieldErrors] = useState({
    companyName: "",
    businessNumber: "",
    contactPerson: "",
    companyEmail: "",
    productType: "",
    pricingPlan: "",
    email: "",
    verificationCode: "",
    password: "",
    passwordConfirm: ""
  })

  // 토스트 표시 함수
  const showToastMessage = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Firebase Auth 상태 확인 (선택적)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })

    return () => unsubscribe()
  }, [])

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (emailVerificationStep === "code-sent" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [emailVerificationStep, timer])

  // 이메일 조합 함수
  const getFullEmail = () => {
    const domain = isDomainInputMode ? customDomain : emailDomain
    return emailUsername && domain ? `${emailUsername}@${domain}` : ""
  }

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    if (!email) {
      setFieldError("email", "필수 입력 항목입니다.")
      return false
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setFieldError("email", "이메일 형식이 올바르지 않습니다.")
      return false
    }
    
    clearFieldError("email")
    return true
  }

  // 이메일 인증 요청
  const handleEmailVerification = async () => {
    const fullEmail = getFullEmail()
    
    if (!validateEmail(fullEmail)) {
      return
    }

    setIsLoading(true)
    
    try {
      // 실제로는 API 호출
      console.log('이메일 인증 요청:', fullEmail)
      
      // 임시: 2초 후 성공 처리
      setTimeout(() => {
        setIsLoading(false)
        setEmailVerificationStep("code-sent")
        setTimer(180)
        showToastMessage("인증번호가 발송되었습니다.", "success")
      }, 2000)
      
    } catch (error) {
      setIsLoading(false)
      console.error('이메일 인증 요청 오류:', error)
      showToastMessage("인증번호 발송에 실패했습니다.", "error")
    }
  }

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setFieldError("verificationCode", "인증번호를 입력해주세요.")
      return
    }

    setIsLoading(true)
    
    try {
      // 실제로는 API 호출
      console.log('인증번호 확인:', verificationCode)
      
      // 임시: 1초 후 성공 처리
      setTimeout(() => {
        setIsLoading(false)
        setEmailVerificationStep("verified")
        clearFieldError("verificationCode")
        showToastMessage("이메일 인증이 완료되었습니다!", "success")
      }, 1000)
      
    } catch (error) {
      setIsLoading(false)
      console.error('인증번호 확인 오류:', error)
      setFieldError("verificationCode", "인증번호가 올바르지 않습니다.")
    }
  }

  // 필드 오류 설정/초기화 함수
  const setFieldError = (field: keyof typeof fieldErrors, message: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: message }))
  }

  const clearFieldError = (field: keyof typeof fieldErrors) => {
    setFieldErrors(prev => ({ ...prev, [field]: "" }))
  }

  // 유효성 검사 함수들
  const validateCompanyInfo = () => {
    let isValid = true

    if (!companyName.trim()) {
      setFieldError("companyName", "회사명을 입력해주세요.")
      isValid = false
    }

    if (!businessNumber.trim()) {
      setFieldError("businessNumber", "사업자번호를 입력해주세요.")
      isValid = false
    } else if (businessNumber.replace(/[^0-9]/g, '').length !== 10) {
      setFieldError("businessNumber", "올바른 사업자번호를 입력해주세요. (10자리)")
      isValid = false
    }

    if (!contactPerson.trim()) {
      setFieldError("contactPerson", "담당자명을 입력해주세요.")
      isValid = false
    }

    if (!companyEmail.trim()) {
      setFieldError("companyEmail", "회사 이메일을 입력해주세요.")
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) {
      setFieldError("companyEmail", "올바른 이메일 형식을 입력해주세요.")
      isValid = false
    }

    if (!productType) {
      setFieldError("productType", "상품 유형을 선택해주세요.")
      isValid = false
    }

    if (!pricingPlan) {
      setFieldError("pricingPlan", "비용 계획을 선택해주세요.")
      isValid = false
    }

    return isValid
  }

  const validateAccountInfo = () => {
    let isValid = true

    if (emailVerificationStep !== "verified") {
      setFieldError("email", "이메일 인증을 완료해주세요.")
      isValid = false
    }

    if (!password) {
      setFieldError("password", "비밀번호를 입력해주세요.")
      isValid = false
    } else if (password.length < 8) {
      setFieldError("password", "비밀번호는 8자 이상 입력해주세요.")
      isValid = false
    }

    if (!passwordConfirm) {
      setFieldError("passwordConfirm", "비밀번호 확인을 입력해주세요.")
      isValid = false
    } else if (password !== passwordConfirm) {
      setFieldError("passwordConfirm", "비밀번호가 일치하지 않습니다.")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async () => {
    // 모든 필드 오류 초기화
    Object.keys(fieldErrors).forEach(key => {
      clearFieldError(key as keyof typeof fieldErrors)
    })

    // 유효성 검사
    const isCompanyValid = validateCompanyInfo()
    const isAccountValid = validateAccountInfo()

    if (!isCompanyValid || !isAccountValid) {
      showToastMessage("입력 정보를 확인해주세요.", "error")
      return
    }

    setIsLoading(true)

    try {
      // 파트너 신청 로직 (추후 구현)
      const applicationData = {
        companyInfo: {
          companyName,
          businessNumber: businessNumber.replace(/[^0-9]/g, ''),
          contactPerson,
          companyEmail,
          productType,
          additionalInfo
        },
        accountInfo: {
          partnerId,
          password // 실제로는 해시화 필요
        },
        status: "pending",
        appliedAt: new Date().toISOString()
      }

      console.log('파트너 신청 데이터:', applicationData)

      // 임시: 2초 후 성공 처리
      setTimeout(() => {
        setIsLoading(false)
        showToastMessage("파트너 신청이 완료되었습니다!", "success")
        
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }, 2000)

    } catch (error) {
      setIsLoading(false)
      console.error('파트너 신청 오류:', error)
      showToastMessage("신청 중 오류가 발생했습니다.", "error")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => {
            router.back()
          }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <button 
            onClick={() => {
              router.push('/')
            }}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="text-center">
              <h1 className="text-lg font-bold" style={{ color: "#1e3a8a" }}>SSDM</h1>
              <p className="text-xs text-muted-foreground">파트너 신청</p>
            </div>
          </button>
          <div className="w-16"></div>
        </div>
      </header>

      <div className="w-full max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">파트너사 신청</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              파트너사 등록을 위한 정보를 입력해주세요
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 회사 정보 박스 */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">회사 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">회사명 *</label>
                    <Input
                      placeholder="회사명을 입력하세요"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value)
                        if (fieldErrors.companyName) clearFieldError("companyName")
                      }}
                      className={fieldErrors.companyName ? "border-red-500" : ""}
                    />
                    {fieldErrors.companyName && (
                      <p className="text-sm text-red-600">{fieldErrors.companyName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">사업자 번호 *</label>
                    <Input
                      placeholder="000-00-00000"
                      value={businessNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, '')
                        if (value.length <= 10) {
                          if (value.length > 3 && value.length <= 5) {
                            value = value.slice(0, 3) + '-' + value.slice(3)
                          } else if (value.length > 5) {
                            value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5)
                          }
                          setBusinessNumber(value)
                          if (fieldErrors.businessNumber) clearFieldError("businessNumber")
                        }
                      }}
                      className={fieldErrors.businessNumber ? "border-red-500" : ""}
                      maxLength={12}
                    />
                    {fieldErrors.businessNumber && (
                      <p className="text-sm text-red-600">{fieldErrors.businessNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">담당자 연락처 *</label>
                    <Input
                      placeholder="담당자명을 입력하세요"
                      value={contactPerson}
                      onChange={(e) => {
                        setContactPerson(e.target.value)
                        if (fieldErrors.contactPerson) clearFieldError("contactPerson")
                      }}
                      className={fieldErrors.contactPerson ? "border-red-500" : ""}
                    />
                    {fieldErrors.contactPerson && (
                      <p className="text-sm text-red-600">{fieldErrors.contactPerson}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">회사 이메일 *</label>
                    <Input
                      type="email"
                      placeholder="company@example.com"
                      value={companyEmail}
                      onChange={(e) => {
                        setCompanyEmail(e.target.value)
                        if (fieldErrors.companyEmail) clearFieldError("companyEmail")
                      }}
                      className={fieldErrors.companyEmail ? "border-red-500" : ""}
                    />
                    {fieldErrors.companyEmail && (
                      <p className="text-sm text-red-600">{fieldErrors.companyEmail}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">상품 유형 *</label>
                    <Select value={productType} onValueChange={(value) => {
                      setProductType(value)
                      if (fieldErrors.productType) clearFieldError("productType")
                    }}>
                      <SelectTrigger className={fieldErrors.productType ? "border-red-500" : ""}>
                        <SelectValue placeholder="상품 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fintech">핀테크</SelectItem>
                        <SelectItem value="ecommerce">이커머스</SelectItem>
                        <SelectItem value="healthcare">헬스케어</SelectItem>
                        <SelectItem value="education">교육</SelectItem>
                        <SelectItem value="logistics">물류</SelectItem>
                        <SelectItem value="other">기타</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.productType && (
                      <p className="text-sm text-red-600">{fieldErrors.productType}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">이용 플랜 *</label>
                    <Select value={pricingPlan} onValueChange={(value) => {
                      setPricingPlan(value)
                      if (fieldErrors.pricingPlan) clearFieldError("pricingPlan")
                    }}>
                      <SelectTrigger className={fieldErrors.pricingPlan ? "border-red-500" : ""}>
                        <SelectValue placeholder="이용 플랜을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">무료</SelectItem>
                        <SelectItem value="membership">멤버십</SelectItem>
                        <SelectItem value="standard">스탠다드</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.pricingPlan && (
                      <p className="text-sm text-red-600">{fieldErrors.pricingPlan}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 계정 정보 박스 */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">계정 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 이메일 입력 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">이메일 *</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="이메일 아이디"
                      value={emailUsername}
                      onChange={(e) => {
                        setEmailUsername(e.target.value)
                        if (fieldErrors.email) clearFieldError("email")
                      }}
                      className={`flex-1 ${fieldErrors.email ? "border-red-500" : ""}`}
                      disabled={emailVerificationStep === "verified"}
                    />
                    <span className="flex items-center">@</span>
                    {isDomainInputMode ? (
                      <Input
                        placeholder="도메인 입력"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        className="flex-1"
                        disabled={emailVerificationStep === "verified"}
                      />
                    ) : (
                      <Select 
                        value={emailDomain} 
                        onValueChange={(value) => {
                          if (value === "custom") {
                            setIsDomainInputMode(true)
                            setEmailDomain("")
                          } else {
                            setEmailDomain(value)
                          }
                        }}
                        disabled={emailVerificationStep === "verified"}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="도메인 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gmail.com">gmail.com</SelectItem>
                          <SelectItem value="naver.com">naver.com</SelectItem>
                          <SelectItem value="daum.net">daum.net</SelectItem>
                          <SelectItem value="yahoo.com">yahoo.com</SelectItem>
                          <SelectItem value="custom">직접 입력</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {fieldErrors.email && (
                    <p className="text-sm text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                {/* 이메일 인증 */}
                {emailVerificationStep === "initial" && (
                  <Button
                    onClick={handleEmailVerification}
                    disabled={!emailUsername || (!emailDomain && !customDomain) || isLoading}
                    className="w-full"
                    style={{ backgroundColor: "#1e3a8a" }}
                  >
                    {isLoading ? "발송 중..." : "이메일 인증하기"}
                  </Button>
                )}

                {emailVerificationStep === "code-sent" && (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="인증번호 6자리"
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value)
                          if (fieldErrors.verificationCode) clearFieldError("verificationCode")
                        }}
                        className={`flex-1 ${fieldErrors.verificationCode ? "border-red-500" : ""}`}
                        maxLength={6}
                      />
                      <Button
                        onClick={handleVerifyCode}
                        disabled={!verificationCode || isLoading}
                        style={{ backgroundColor: "#1e3a8a" }}
                      >
                        {isLoading ? "확인 중..." : "확인"}
                      </Button>
                    </div>
                    {fieldErrors.verificationCode && (
                      <p className="text-sm text-red-600">{fieldErrors.verificationCode}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} 후 만료
                    </p>
                  </div>
                )}

                {emailVerificationStep === "verified" && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <span className="text-sm">✓ 이메일 인증이 완료되었습니다</span>
                  </div>
                )}

                {/* 비밀번호 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">비밀번호 *</label>
                    <Input
                      type="password"
                      placeholder="비밀번호 (8자 이상)"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (fieldErrors.password) clearFieldError("password")
                      }}
                      className={fieldErrors.password ? "border-red-500" : ""}
                    />
                    {fieldErrors.password && (
                      <p className="text-sm text-red-600">{fieldErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">비밀번호 확인 *</label>
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      value={passwordConfirm}
                      onChange={(e) => {
                        setPasswordConfirm(e.target.value)
                        if (fieldErrors.passwordConfirm) clearFieldError("passwordConfirm")
                      }}
                      className={fieldErrors.passwordConfirm ? "border-red-500" : ""}
                    />
                    {fieldErrors.passwordConfirm && (
                      <p className="text-sm text-red-600">{fieldErrors.passwordConfirm}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 신청 버튼 */}
            <div className="pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full text-white py-3 text-base font-medium"
                style={{ backgroundColor: "#1e3a8a" }}
              >
                {isLoading ? "신청 중..." : "신청하기"}
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
