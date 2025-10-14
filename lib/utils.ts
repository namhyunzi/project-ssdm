import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 휴대폰 번호 뒷자리 포맷팅 함수 (8자리 입력용)
 * @param phone - 포맷팅할 전화번호 뒷자리 문자열 (8자리)
 * @returns 포맷팅된 전화번호 문자열 (1234-5678 형식)
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ''
  
  const numbers = phone.replace(/\D/g, '')
  
  // 8자리 뒷자리만 처리 (1234-5678 형식)
  if (numbers.length <= 4) {
    return numbers
  } else if (numbers.length <= 8) {
    return `${numbers.slice(0, 4)}-${numbers.slice(4)}`
  } else {
    // 8자리 초과 시 자르기
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`
  }
}

/**
 * 전체 휴대폰 번호 포맷팅 함수 (표시용)
 * @param phone - 포맷팅할 전체 전화번호 문자열
 * @returns 포맷팅된 전화번호 문자열 (010-1234-5678 형식)
 */
export function formatFullPhoneNumber(phone: string): string {
  if (!phone) return ''
  
  const numbers = phone.replace(/\D/g, '')
  
  if (numbers.length === 11) {
    // 010-1234-5678 형식 (010 + 8자리)
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
  } else if (numbers.length === 10) {
    // 02-1234-5678 형식 (지역번호 + 8자리)
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`
  } else if (numbers.length === 8) {
    // 1234-5678 형식 (8자리만)
    return `${numbers.slice(0, 4)}-${numbers.slice(4)}`
  }
  
  return phone
}

/**
 * 타이머 시간 포맷팅 함수 (초를 MM:SS 형식으로 변환)
 * @param seconds - 포맷팅할 초 단위 시간
 * @returns 포맷팅된 시간 문자열 (MM:SS 형식)
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

/**
 * Daum 우편번호 API 주소 찾기 함수
 * @param setZipCode - 우편번호 설정 함수
 * @param setAddress - 주소 설정 함수
 */
export function handleAddressSearch(
  setZipCode: (zipCode: string) => void,
  setAddress: (address: string) => void
) {
  if (typeof window !== 'undefined' && window.daum) {
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 도로명 주소와 지번 주소 모두 사용 가능
        let addr = '';
        let extraAddr = '';

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else { // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if(data.userSelectedType === 'R'){
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
            extraAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if(data.buildingName !== '' && data.apartment === 'Y'){
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if(extraAddr !== ''){
            extraAddr = ' (' + extraAddr + ')';
          }
        }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
        setZipCode(data.zonecode);
        // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
        if(extraAddr !== ''){
          setAddress(addr + extraAddr);
        } else {
          setAddress(addr);
        }
      }
    }).open();
  } else {
    alert('우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
  }
}
