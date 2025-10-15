"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Trash2, Database } from "lucide-react"

export default function PrivacyOptionPage() {
  const [selectedOption, setSelectedOption] = useState<"temporary" | "storage" | null>(null)

  const handleOptionSelect = (option: "temporary" | "storage") => {
    setSelectedOption(option)
  }

  const handleConfirm = () => {
    if (selectedOption === "temporary") {
      // 일회성 처리 로직
      console.log("일회성 처리 선택")
      // 팝업 닫기 또는 다음 단계로 이동
    } else if (selectedOption === "storage") {
      // SSDM 저장 처리 로직
      console.log("SSDM 저장 선택")
      // 팝업 닫기 또는 다음 단계로 이동
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">개인정보 처리 방식 선택</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            개인정보를 어떻게 처리하시겠습니까?
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 옵션 1: 일회성 처리 */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedOption === "temporary" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:bg-muted/30"
            }`}
            onClick={() => handleOptionSelect("temporary")}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                selectedOption === "temporary" 
                  ? "border-primary bg-primary" 
                  : "border-muted-foreground"
              }`}>
                {selectedOption === "temporary" && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Trash2 className="h-5 w-5 text-orange-600" />
                  <h3 className="font-medium">이번 주문에만 사용</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  개인정보가 쇼핑몰에 저장되지 않습니다
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  배송 완료 후 자동 삭제됩니다
                </p>
              </div>
            </div>
          </div>

          {/* 옵션 2: SSDM 저장 */}
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedOption === "storage" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:bg-muted/30"
            }`}
            onClick={() => handleOptionSelect("storage")}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                selectedOption === "storage" 
                  ? "border-primary bg-primary" 
                  : "border-muted-foreground"
              }`}>
                {selectedOption === "storage" && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">SSDM에 안전하게 저장</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  다음 주문 시 편리하게 사용 가능
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  분산 저장으로 보안 강화
                </p>
              </div>
            </div>
          </div>

          {/* 보안 안내 */}
          <div className="bg-primary/10 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-primary mt-0.5" />
              <p className="text-xs text-muted-foreground">
                개인정보는 SSDM을 통해 안전하게 처리됩니다
              </p>
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                // 취소 로직
                console.log("취소")
              }}
            >
              취소
            </Button>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleConfirm}
              disabled={!selectedOption}
            >
              {selectedOption === "temporary" ? "일회성으로 진행" : 
               selectedOption === "storage" ? "SSDM에 저장" : "확인"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
