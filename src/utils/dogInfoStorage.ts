/**
 * 강아지 정보 쿠키 저장 및 불러오기 유틸리티
 */

export interface DogInfo {
  name: string;
  breed: string;
  sex: "male" | "female";
  birthYear: string;
  birthMonth: string;
  birthDay: string;
}

const DOG_INFO_COOKIE_KEY = 'pawstars_dog_info';

/**
 * 쿠키에 강아지 정보 저장
 */
export function saveDogInfo(dogInfo: DogInfo): void {
  try {
    const cookieValue = encodeURIComponent(JSON.stringify(dogInfo));
    // 30일 동안 저장
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    document.cookie = `${DOG_INFO_COOKIE_KEY}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
  } catch (error) {
    console.error('강아지 정보 저장 실패:', error);
  }
}

/**
 * 쿠키에서 강아지 정보 불러오기
 */
export function loadDogInfo(): DogInfo | null {
  try {
    const cookies = document.cookie.split(';');
    const dogInfoCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${DOG_INFO_COOKIE_KEY}=`)
    );
    
    if (!dogInfoCookie) {
      return null;
    }
    
    const cookieValue = dogInfoCookie.split('=')[1];
    const decodedValue = decodeURIComponent(cookieValue);
    const dogInfo = JSON.parse(decodedValue) as DogInfo;
    
    // 데이터 유효성 검사
    if (dogInfo.name && dogInfo.breed && dogInfo.sex && 
        dogInfo.birthYear && dogInfo.birthMonth && dogInfo.birthDay) {
      return dogInfo;
    }
    
    return null;
  } catch (error) {
    console.error('강아지 정보 불러오기 실패:', error);
    return null;
  }
}

/**
 * 쿠키에서 강아지 정보 삭제
 */
export function clearDogInfo(): void {
  try {
    document.cookie = `${DOG_INFO_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (error) {
    console.error('강아지 정보 삭제 실패:', error);
  }
}

