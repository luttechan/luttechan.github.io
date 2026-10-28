# 2026 GAC MT

부산외국어대학교 GAC 2026년 2학기 MT 홍보 페이지.

- 서비스 주소: https://luttechan.github.io/2026mt/
- 일정: 2026-11-06(금) ~ 2026-11-07(토). 사용자 확인 완료.
- 숙소: 송정 해수락, 부산광역시 해운대구 송정해변로 8-17
- 참가비: 40,000원 / BNK 부산은행 101-2094-2719-07 / 오진영

## 실행과 수정

빌드가 필요 없는 HTML/CSS/JavaScript 정적 사이트입니다. 저장소의 기존 페이지는 수정하지 않았습니다. 저장소 루트에서 `python -m http.server 8000`을 실행한 후 `/2026mt/`에 접속합니다. GitHub Pages의 기존 main 브랜치 배포 설정을 그대로 사용합니다.

- `index.html`: 문구, 행사 정보, 사진과 계좌 안내
- `style.css`: 반응형 디자인, 모션 감소 설정
- `app.js`: 출발역별 노선도, 사진 모달, 복사, 지도
- `assets/`: 공식 로고, 숙소 사진 4장, 송정 사진, 웹폰트, 지도 라이브러리, 캘린더 일정

별도 유료 API 키나 백엔드 없이 Leaflet 1.9.4 API와 OpenStreetMap 공개 타일을 사용합니다. 지도 타일은 인터넷 연결이 필요합니다. 브라우저 위치 정보는 요청하지 않습니다. 트래픽이 커지면 OSM 타일 정책에 맞는 별도 타일 제공자로 변경하세요. 카카오맵/네이버 지도 외부 링크도 제공합니다.

참가 신청 URL, 집결 장소·시각, 입금 기한은 제공되지 않아 임의로 만들지 않았습니다. 프로그램 순서는 예정으로 표시했습니다. 캘린더는 이틀짜리 종일 일정이며 종료일은 iCalendar 규격에 따라 11월 8일(배타적)입니다.

## 자료 출처

확인일: 2026-10-29

1. BUFS 로고: https://eu.bufs.ac.kr/data/logo/top_logo_c.png
   - 안내: https://eu.bufs.ac.kr/bbs/board.php?bo_table=aboutbufs
2. BNK 부산은행 로고: https://www.busanbank.co.kr/resource/img/tit/h1_busanbank_new2.png
   - CI: https://www.busanbank.co.kr/ib20/mnu/BHPBKI400004000
   - 로고는 소속/입금 은행 안내 목적으로 원본 비율을 유지했습니다. 후원 표시는 아닙니다.
3. 숙소 사진: 사용자 제공 원본 4장.
4. 송정해수욕장 사진: Sgroey / Wikimedia Commons / CC BY-SA 4.0
   - https://commons.wikimedia.org/wiki/File:Songjeong_at_the_beach_13.jpg
   - https://creativecommons.org/licenses/by-sa/4.0/
   - 파일 원본 유지. CSS object-fit으로 표시. 2024년 여름의 지역 참고 사진.
5. 역 순서: 부산교통공사 사이버스테이션
   - https://work.humetro.busan.kr/homepage/cyberstation/map.do
   - 노선색은 공식 이미지의 주요 불투명 색상값에서 추출했습니다.
   - 1호선 #F66130: /homepage/default/img/cyber-station/line-1-ball.png
   - 동해선 #4EAFD6: /homepage/default/img/cyber-station/line-8-ball.png
   - 교대에서 동해선으로 환승하는 안내 경로입니다. 실시간 최단 경로/운행 시간 API는 아닙니다.
6. 숙소 좌표: 위도 35.1814653368977 / 경도 129.2043528933586
   - 주소 대조: https://flg.purpleo.co.kr/view/3547
7. Leaflet 1.9.4 (BSD-2-Clause): https://leafletjs.com / https://github.com/Leaflet/Leaflet/blob/v1.9.4/LICENSE
8. OpenStreetMap 기여자: https://www.openstreetmap.org/copyright
9. Pretendard 1.3.9 (SIL Open Font License 1.1): https://github.com/orioncactus/pretendard

이 페이지는 기관의 공식 홍보 페이지라는 의미가 아닌 GAC 행사 안내 페이지입니다.
