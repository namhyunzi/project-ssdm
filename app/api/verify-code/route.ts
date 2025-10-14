import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/firebase-verification';
import { isValidCodeFormat } from '@/lib/verification';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // 이메일 검증
    if (!email) {
      return NextResponse.json(
        { error: '이메일 정보가 없습니다. 다시 시도해주세요.' },
        { status: 400 }
      );
    }

    // 인증코드 검증
    if (!code) {
      return NextResponse.json(
        { error: '인증코드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 인증코드 형식 검증
    if (!isValidCodeFormat(code)) {
      return NextResponse.json(
        { error: '올바른 인증코드 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // Firebase에서 인증코드 검증
    const result = await verifyCode(email, code);

    if (result.isValid) {
      return NextResponse.json({
        success: true,
        message: '인증이 완료되었습니다.',
      });
    } else {
      return NextResponse.json(
        { error: result.error || '인증에 실패했습니다.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('인증코드 검증 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
