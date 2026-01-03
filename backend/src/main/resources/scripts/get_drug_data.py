import os
from dotenv import load_dotenv
import requests
import pymysql

# .env 파일 로드
load_dotenv()

# 환경 변수에서 가져오기 (하드코딩 제거)
API_KEY = os.getenv("API_KEY")
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_NAME = os.getenv("DB_NAME")    # 사용 중인 데이터베이스 이름

# API URL (e약은요 - 의약품개요정보조회)
URL = "http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList"


def get_db_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )


def main():
    conn = get_db_connection()
    cursor = conn.cursor()

    page = 1
    num_of_rows = 100  # 한 번에 가져올 개수 (최대 100~300 권장)
    total_inserted = 0

    print(">>> 데이터 수집을 시작합니다...")

    while True:
        try:
            params = {
                'serviceKey': API_KEY,
                'pageNo': page,
                'numOfRows': num_of_rows,
                'type': 'json'  # JSON 형식으로 요청
            }

            response = requests.get(URL, params=params)

            # 응답 상태 확인
            if response.status_code != 200:
                print(f"Error: API 호출 실패 (Status: {response.status_code})")
                break

            # JSON 파싱
            data = response.json()

            # 데이터 구조 확인 (body -> items)
            if 'body' not in data or 'items' not in data['body']:
                print("더 이상 데이터가 없거나, 응답 형식이 올바르지 않습니다.")
                break

            items = data['body']['items']

            # 데이터가 없으면 종료 (마지막 페이지 도달)
            if not items:
                print(">>> 모든 데이터를 가져왔습니다.")
                break

            # DB Insert 쿼리
            insert_sql = """
                INSERT INTO drug_overview (
                    item_seq, entp_name, item_name,
                    efficacy_text, use_method_text,
                    warning_text_1, warning_text_2,
                    interaction_text, side_effect_text,
                    storage_method_text, update_date
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    update_date = VALUES(update_date),
                    efficacy_text = VALUES(efficacy_text)
            """

            # 데이터 바인딩 준비
            for item in items:
                # API 항목명 -> DB 컬럼 매핑
                val = (
                    item.get('itemSeq'),           # 품목기준코드
                    item.get('entpName'),          # 업체명
                    item.get('itemName'),          # 제품명
                    item.get('efcyQesitm'),        # 문항1(효능)
                    item.get('useMethodQesitm'),   # 문항2(사용법)
                    item.get('atpnWarnQesitm'),    # 문항3(경고)
                    item.get('atpnQesitm'),        # 문항4(주의사항)
                    item.get('intrcQesitm'),       # 문항5(상호작용)
                    item.get('seQesitm'),          # 문항6(부작용)
                    item.get('depositMethodQesitm'), # 문항7(보관법)
                    item.get('updateDe')           # 수정일자
                )
                cursor.execute(insert_sql, val)

            conn.commit()
            count = len(items)
            total_inserted += count
            print(f"Page {page} 완료: {count}건 저장 (누적: {total_inserted}건)")

            page += 1
            # 공공데이터 서버 부하 방지를 위해 아주 살짝 대기 (선택사항)
            # time.sleep(0.1)

        except Exception as e:
            print(f"Error 발생: {e}")
            break

    conn.close()
    print(">>> 작업 종료.")

if __name__ == "__main__":
    main()