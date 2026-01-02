import pandas as pd
import pymysql

# ==========================================
# 1. DB 연결 설정 (본인 환경에 맞게 수정)
# ==========================================
DB_HOST = "localhost"
DB_USER = "root"
DB_PASS = "thdustkfkd09!"  # 비밀번호 입력
DB_NAME = "timetopill" # DB 이름 입력

def get_db_connection():
    return pymysql.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASS, db=DB_NAME, charset='utf8mb4'
    )

FILES = {
    "age": "의약품안전사용서비스(DUR)_연령금기 품목리스트 2025.6.csv",
    "preg": "의약품안전사용서비스(DUR)_임부금기 품목리스트 2025.6.csv",
    "old": "의약품안전사용서비스(DUR)_노인주의 품목리스트 2025.6.csv",
    "old_nsaid": "의약품안전사용서비스(DUR)_노인주의(해열진통소염제) 품목리스트 2025.6.csv",
    "combo": "의약품안전사용서비스(DUR)_병용금기 품목리스트 2025.6.csv" # [NEW] 파일명 정확히 입력
}

def clean_text(text):
    if pd.isna(text): return ""
    return str(text).strip()

def process_and_insert():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. 기존 데이터 삭제 (테이블 2개 모두 초기화)
    print(">>> 기존 데이터를 초기화합니다...")
    cursor.execute("TRUNCATE TABLE dur_info")
    cursor.execute("TRUNCATE TABLE dur_combination_info") # [NEW]
    conn.commit()

    total_count = 0

    for key, filename in FILES.items():
        print(f">>> '{filename}' 처리 중...")

        try:
            try:
                df = pd.read_csv(filename, encoding='cp949')
            except:
                df = pd.read_csv(filename, encoding='utf-8')

            data_list = []

            # [CASE 1] 병용금기 파일 처리 (구조가 다름)
            if key == "combo":
                for _, row in df.iterrows():
                    code_a = clean_text(row.get('제품코드A', ''))
                    name_a = clean_text(row.get('제품명A', ''))
                    code_b = clean_text(row.get('제품코드B', ''))
                    name_b = clean_text(row.get('제품명B', ''))
                    content = clean_text(row.get('상세정보', ''))
                    remark = clean_text(row.get('비고', ''))

                    data_list.append((code_a, name_a, code_b, name_b, content, remark))

                # 병용금기 전용 INSERT 쿼리
                sql = """
                    INSERT INTO dur_combination_info
                    (item_code_a, item_name_a, item_code_b, item_name_b, prohibited_content, remark)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                cursor.executemany(sql, data_list)

            # [CASE 2] 일반 금기 파일 처리 (기존 로직)
            else:
                for _, row in df.iterrows():
                    item_code = clean_text(row.get('제품코드', ''))
                    item_name = clean_text(row.get('제품명', ''))
                    remark = clean_text(row.get('비고', ''))

                    type_name = ""
                    content = ""

                    if key == "age":
                        type_name = "연령금기"
                        age = clean_text(row.get('특정연령', '')).split(' ')[0]
                        unit = clean_text(row.get('특정연령단위', '')).split(' ')[0]
                        cond = clean_text(row.get('연령처리조건', '')).split(' ')[0]
                        detail = clean_text(row.get('상세정보', ''))
                        content = f"{age}{unit} {cond} 금기. {detail}"

                    elif key == "preg":
                        type_name = "임부금기"
                        grade = clean_text(row.get('금기등급', ''))
                        detail = clean_text(row.get('상세정보', ''))
                        content = f"[등급 {grade}] {detail}"

                    elif "old" in key:
                        type_name = "노인주의" if key == "old" else "노인주의(해열진통소염제)"
                        content = clean_text(row.get('약품상세정보', ''))

                    data_list.append((item_code, item_name, type_name, content, remark))

                # 일반 금기용 INSERT 쿼리
                sql = """
                    INSERT INTO dur_info
                    (item_code, item_name, type_name, prohibited_content, remark)
                    VALUES (%s, %s, %s, %s, %s)
                """
                cursor.executemany(sql, data_list)

            conn.commit()
            print(f"   -> {len(data_list)}건 저장 완료.")
            total_count += len(data_list)

        except Exception as e:
            print(f"   [Error] 파일 처리 중 오류 발생: {e}")

    conn.close()
    print(f"\n>>> 모든 작업 완료! 총 {total_count}건의 데이터가 적재되었습니다.")

if __name__ == "__main__":
    process_and_insert()