# Lutté — personal developer page

https://luttechan.github.io/

블랙 테마의 반응형 정적 개발자 포트폴리오. 홈은 index.html, 클로네 소개와 인물 설정집은 clone.html입니다. 빌드나 패키지 설치 없이 GitHub Pages에서 동작합니다.

## 클로네 이미지 추가

1. 이미지를 GitHub에 올립니다.
2. 이미지의 Raw HTTPS 링크를 복사합니다.
3. config.js의 characterImageUrl에 붙여넣고 커밋합니다.

예: https://raw.githubusercontent.com/luttechan/luttechan.github.io/main/assets/clone.png

브랜치명과 파일명은 실제 업로드 경로에 맞춥니다. 주소가 없거나 로딩에 실패하면 텍스트 영역을 유지합니다. characterImageAlt에서 이미지 설명을 수정할 수 있습니다.

## 프로젝트 수정

GitHub 공개 저장소를 페이지 단위로 가져와 모두 표시합니다. 새 저장소는 기본 유틸리티 분류입니다. API 제한이나 네트워크 오류 시 assets/projects.json과 내장 목록을 차례로 사용합니다. 제목, 한국어 설명, 분류는 app.js의 curated에서 수정합니다. 외부 데이터는 텍스트로 안전하게 표시합니다.

## 배포

Settings → Pages → Deploy from a branch에서 기본 브랜치와 / (root)를 선택합니다. .nojekyll이 있어 정적 파일을 그대로 제공합니다. 기존 _config.yml은 보존하지만 사용하지 않습니다.

## 접근성

반응형 프로젝트 목록, 키보드 포커스, 건너뛰기 링크, 검색 결과 알림을 지원합니다. 포인터에 반응하는 조명과 호버 효과, 스크롤 등장 효과를 제공합니다. OS의 동작 줄이기 설정에서는 애니메이션을 끕니다. 한글 Pretendard Variable과 영문 Manrope를 assets/fonts에 포함하여 제공합니다. 해당 폴더에 각 폰트의 SIL Open Font License를 동봉했습니다. 폰트 로딩 실패 시 sans-serif로 표시합니다.

## 디자인 참고

- https://www.figma.com/resource-library/web-design-trends/
- https://www.squarespace.com/blog/web-design-trends

## 클로네 인물 설정집

config.js의 characterProfile에서 항목을 편집합니다. 각 배열에 { label: '항목', value: '내용' }을 추가하면 clone.html에 표시됩니다.

- identity: 기본 정보
- appearance: 외형
- personality: 성격
- background: 배경
- relationships: 관계
- notes: 기타 설정

characterProfileNote는 설정집 머리말입니다. 미제공 설정은 창작하지 않았으며 현재 이름과 오리지널 캐릭터라는 구분만 등록했습니다. 기존 characterImageUrl 설정은 그대로 유지됩니다.
