import os

# Template content from sowon.html (simplified/cleaned for template use)
template = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - g&b Planning</title>
    <link rel="stylesheet" href="../../style/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Detail Page Specific Styles */
        .detail-hero {{
            padding: 180px 0 100px;
            text-align: left;
        }}

        .detail-hero h1 {{
            font-size: 3rem;
            font-weight: 700;
            line-height: 1.3;
            color: var(--primary-color);
            margin-bottom: 20px;
        }}

        .detail-hero p {{
            font-size: 1.2rem;
            color: var(--text-muted);
        }}

        .detail-section {{
            padding: 100px 0;
            border-bottom: 1px solid #f0f0f0;
        }}

        .detail-section:last-child {{
            border-bottom: none;
        }}

        .detail-title {{
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--secondary-color);
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}

        .detail-content {{
            font-size: 1.25rem;
            line-height: 1.8;
            color: var(--text-main);
            max-width: 800px;
        }}

        .detail-list {{
            list-style: none;
            padding: 0;
            margin-top: 30px;
        }}

        .detail-list li {{
            position: relative;
            padding-left: 20px;
            margin-bottom: 15px;
        }}

        .detail-list li::before {{
            content: "–";
            position: absolute;
            left: 0;
            color: var(--text-muted);
        }}

        .pattern-link {{
            display: inline-block;
            margin-top: 20px;
            color: var(--secondary-color);
            text-decoration: underline;
            text-underline-offset: 5px;
            font-weight: 600;
        }}

        .next-move-btns {{
            display: flex;
            gap: 20px;
            margin-top: 40px;
        }}
        
        /* Responsive adjustments */
        @media (max-width: 768px) {{
            .next-move-btns {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                width: 100%;
            }}
            .next-move-btns .btn {{
                width: 100%;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
            }}
        }}
    </style>
</head>
<body>

    <!-- Header -->
    <header>
        <div class="container">
            <a href="../../index.html" class="logo"><span class="logo-g">g</span>&<span class="logo-b">b</span> <span>Planning</span></a>
            <nav>
                <ul class="nav-links">
                    <li><a href="../../company.html">소개</a></li>
                    <li><a href="../../business.html">일하는 방식</a></li>
                    <li><a href="../../portfolio.html" class="active">포트폴리오</a></li>
                    <li><a href="../../contact.html">연락하기</a></li>
                </ul>
                <div class="mobile-menu-btn">
                    <i class="fas fa-bars"></i>
                </div>
            </nav>
        </div>
    </header>

    <!-- [SECTION 01] CASE HERO -->
    <section class="detail-hero">
        <div class="container fade-wrap">
            <h1>{main_title}</h1>
            <p style="margin-top: 30px;">{category}</p>
        </div>
    </section>

    <div class="visual-break fade-wrap">
        <img src="../../img/{image_file}" alt="Project Image">
    </div>

    <!-- [SECTION 02] 프로젝트 개요 -->
    <section class="detail-section">
        <div class="container fade-wrap">
            <div class="detail-title">01. 프로젝트 개요</div>
            <div class="detail-content">
                <p>{overview_text}</p>
                <ul class="detail-list">
                    <li>{list_item_1}</li>
                    <li>{list_item_2}</li>
                    <li>{list_item_3}</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- [SECTION 03] 주요 과제 및 해결 방안 -->
    <section class="detail-section">
        <div class="container fade-wrap">
            <div class="detail-title">02. 주요 과제 및 해결</div>
            <div class="detail-content">
                <p>
                    {challenge_text}
                </p>
                <ul class="detail-list">
                    <li>{solution_item_1}</li>
                    <li>{solution_item_2}</li>
                    <li>{solution_item_3}</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- [SECTION 04] 성과 및 결과 -->
    <section class="detail-section bg-muted">
        <div class="container fade-wrap">
            <div class="detail-title">03. 성과 및 결과</div>
            <div class="detail-content">
                <p>
                    {result_text}
                </p>
                <ul class="detail-list">
                    <li>{result_item_1}</li>
                    <li>{result_item_2}</li>
                    <li>{result_item_3}</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- [SECTION 05] 다음 이동 -->
    <section class="detail-section bg-muted">
        <div class="container fade-wrap">
            <div class="detail-title">Next Move</div>
            <div class="detail-content">
                <div class="next-move-btns">
                    <a href="../../portfolio.html" class="btn btn-outline" style="border-color: var(--text-main); color: var(--text-main);">다른 사례 보기</a>
                    <a href="../../business.html" class="btn">우리가 일하는 방식 보기</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-col">
                    <h4><span class="logo-g">g</span>&<span class="logo-b">b</span> Planning</h4>
                    <p>
                        서울시 강남구 논현로36길 31, 3층<br>
                        Tel: 02-458-3248<br>
                        Email: contact@gnbplanning.co.kr
                    </p>
                </div>
             </div>
            <div class="copyright">
                &copy; g&b Planning. All rights reserved.
            </div>
        </div>
    </footer>

    <script src="../../js/script.js"></script>
</body>
</html>
"""

projects = [
    # Regional Capacity Building
    {
        "filename": "projects/regional-capacity/muan-wando.html",
        "title": "무안군 신월항, 완도군 가학항, 솔지항 어촌뉴딜사업",
        "main_title": "무안군 신월항, 완도군 가학항,<br>솔지항 어촌뉴딜사업<br>지역역량강화",
        "category": "지역역량강화 / 어촌뉴딜",
        "image_file": "taean_fishing.png",
        "overview_text": "어촌뉴딜 300 사업의 일환으로 진행된 지역 주민 역량 강화 프로젝트입니다.",
        "list_item_1": "주민 주도형 지역 발전 모델 구축",
        "list_item_2": "지속 가능한 어촌 마을 운영을 위한 교육 프로그램 실행",
        "list_item_3": "공동체 활성화 및 갈등 관리",
        "challenge_text": "다양한 주민들의 이해관계를 조율하고 실질적인 참여를 이끌어내는 것이 관건이었습니다.",
        "solution_item_1": "맞춤형 현장 포럼 운영",
        "solution_item_2": "선진지 견학을 통한 동기 부여",
        "solution_item_3": "주민 협의체 구성 및 운영 지원",
        "result_text": "주민들의 자발적인 참여 구조가 확립되었으며, 사업 종료 후에도 지속 가능한 운영 기반이 마련되었습니다.",
        "result_item_1": "성공적인 협동조합 설립 지원",
        "result_item_2": "주민 만족도 높은 교육 프로그램 운영",
        "result_item_3": "지역 특화 상품 개발 아이디어 도출"
    },
    {
        "filename": "projects/regional-capacity/incheon-special.html",
        "title": "2021년 인천 어촌특화지원",
        "main_title": "2021년 인천 어촌특화지원<br>기초역량강화",
        "category": "지역역량강화 / 어촌특화",
        "image_file": "taean_fishing.png",
        "overview_text": "인천 지역 어촌의 특성을 살린 특화 발전 전략을 수립하고 주민 역량을 키우는 사업입니다.",
        "list_item_1": "어촌 특성 분석 및 발전 방향 설정",
        "list_item_2": "기초 역량 강화를 위한 교육 및 워크숍",
        "list_item_3": "주민 리더 발굴 및 육성",
        "challenge_text": "도시와 인접한 어촌의 특수성을 고려하여 차별화된 발전 모델을 찾는 것이 중요했습니다.",
        "solution_item_1": "수도권 배후 시장을 겨냥한 체험 프로그램 기획",
        "solution_item_2": "SNS 활용 마케팅 교육",
        "solution_item_3": "지역 자원 조사 및 DB 구축",
        "result_text": "어촌계의 새로운 소득 창출 기회를 발견하고 주민들의 자신감을 고취시켰습니다.",
        "result_item_1": "특화 상품 시제품 개발",
        "result_item_2": "신규 소득원 발굴",
        "result_item_3": "지자체 사업 참여 기반 마련"
    },
    {
        "filename": "projects/regional-capacity/buyeo-seokseong.html",
        "title": "부여군 석성면 기초생활거점육성사업",
        "main_title": "부여군 석성면<br>기초생활거점육성사업<br>지역역량강화",
        "category": "지역역량강화 / 농촌개발",
        "image_file": "seocheon_farming.png",
        "overview_text": "부여군 석성면의 기초생활 거점 기능을 강화하고 배후 마을 주민들의 삶의 질을 높이는 프로젝트입니다.",
        "list_item_1": "문화 복지 프로그램 운영",
        "list_item_2": "거점 시설 운영 활성화 컨설팅",
        "list_item_3": "배후 마을 전달 체계 구축",
        "challenge_text": "노령화된 농촌 지역에서 주민들이 쉽게 참여하고 즐길 수 있는 프로그램을 만드는 것이 필요했습니다.",
        "solution_item_1": "찾아가는 문화 교실 운영",
        "solution_item_2": "동아리 활동 지원 및 활성화",
        "solution_item_3": "주민 자치 운영 위원회 역량 강화",
        "result_text": "면 소재지의 거점 기능이 회복되고 주민들의 문화적 소외감이 해소되었습니다.",
        "result_item_1": "주민 동아리 5개 육성",
        "result_item_2": "거점 시설 이용률 200% 증가",
        "result_item_3": "지속적인 문화 축제 개최 기반 마련"
    },
    {
        "filename": "projects/regional-capacity/seocheon-songseok.html",
        "title": "서천군 송석항 어촌뉴딜사업",
        "main_title": "서천군 송석항<br>어촌뉴딜사업<br>지역역량강화",
        "category": "지역역량강화 / 어촌뉴딜",
        "image_file": "taean_fishing.png",
        "overview_text": "서천군 송석항의 정주 여건을 개선하고 어항 기능을 활성화하기 위한 주민 역량 강화 사업입니다.",
        "list_item_1": "어항 환경 개선 캠페인",
        "list_item_2": "해녀 및 어업인 안전 교육",
        "list_item_3": "지역 수산물 브랜드화",
        "challenge_text": "전통적인 어업 방식과 새로운 관광 트렌드를 접목하는 데 있어 주민 공감대 형성이 필요했습니다.",
        "solution_item_1": "선진지 답사를 통한 성공 사례 벤치마킹",
        "solution_item_2": "주민 주도 경관 개선 활동",
        "solution_item_3": "수산물 가공 및 유통 컨설팅",
        "result_text": "깨끗하고 활기찬 항구로 변모하였으며 주민들의 공동체 의식이 강화되었습니다.",
        "result_item_1": "마을 환경 정비 및 경관 개선",
        "result_item_2": "지역 특산물 판매량 증대",
        "result_item_3": "신규 방문객 유입 증가"
    },
    {
        "filename": "projects/regional-capacity/mandae-baeksajang.html",
        "title": "만대항, 백사장항 어촌뉴딜300사업",
        "main_title": "만대항, 백사장항<br>어촌뉴딜300사업<br>지역역량강화",
        "category": "지역역량강화 / 어촌뉴딜",
        "image_file": "taean_fishing.png",
        "overview_text": "태안군의 주요 항구인 만대항과 백사장항을 대상으로 한 대규모 역량 강화 프로젝트입니다.",
        "list_item_1": "광역 어촌 네트워크 구축",
        "list_item_2": "해양 관광 콘텐츠 개발",
        "list_item_3": "주민 소득 증대 프로그램 실행",
        "challenge_text": "두 항구의 지리적 특성과 주민 성향을 고려한 맞춤형 전략 수립이 요구되었습니다.",
        "solution_item_1": "항구별 특화 발전 계획 수립",
        "solution_item_2": "통합 브랜딩 및 홍보 마케팅",
        "solution_item_3": "차세대 어촌 리더 육성 교육",
        "result_text": "서해안 대표 어항으로서의 경쟁력을 확보하고 주민들의 자부심이 높아졌습니다.",
        "result_item_1": "방문객 만족도 향상",
        "result_item_2": "지역 축제 활성화",
        "result_item_3": "어촌계 운영 시스템 체계화"
    },
    # Marketing
    {
        "filename": "projects/marketing/meal-kit.html",
        "title": "밀키트 개발",
        "main_title": "지역 특산물을 활용한<br>프리미엄 밀키트<br>상품 개발",
        "category": "홍보 · 마케팅 / 상품개발",
        "image_file": "seocheon_farming.png",
        "overview_text": "지역의 신선한 특산물을 누구나 간편하게 즐길 수 있도록 밀키트 상품을 기획하고 개발했습니다.",
        "list_item_1": "시장 트렌드 분석 및 메뉴 개발",
        "list_item_2": "패키지 디자인 및 브랜딩",
        "list_item_3": "유통 채널 확보 및 입점 지원",
        "challenge_text": "기존의 단순 농산물 판매에서 벗어나 고부가가치 가공식품으로 전환하는 과정이 필요했습니다.",
        "solution_item_1": "전문 셰프와 협업하여 레시피 표준화",
        "solution_item_2": "친환경 포장재 도입",
        "solution_item_3": "크라우드 펀딩을 통한 초기 마케팅",
        "result_text": "온라인 시장 진입에 성공하여 지역 농가의 새로운 소득원을 창출했습니다.",
        "result_item_1": "크라우드 펀딩 목표액 300% 달성",
        "result_item_2": "온라인 마켓 입점 성공",
        "result_item_3": "지역 대표 먹거리 상품 등극"
    },
    {
        "filename": "projects/marketing/promo-video.html",
        "title": "홍보영상 제작",
        "main_title": "지역의 이야기를 담은<br>감성 홍보 영상<br>제작",
        "category": "홍보 · 마케팅 / 영상제작",
        "image_file": "shinan_island.png",
        "overview_text": "지역의 아름다운 풍경과 사람들의 이야기를 담아 방문 욕구를 자극하는 홍보 영상을 제작했습니다.",
        "list_item_1": "영상 기획 및 스토리보드 작성",
        "list_item_2": "전문 장비를 활용한 현지 촬영 (드론 등)",
        "list_item_3": "유튜브 및 SNS 바이럴 마케팅",
        "challenge_text": "천편일률적인 홍보 영상에서 벗어나 젊은 세대에게 어필할 수 있는 감각적인 영상미가 필요했습니다.",
        "solution_item_1": "시네마틱 기법을 활용한 영상미 구현",
        "solution_item_2": "ASMR 등 트렌디한 요소 반영",
        "solution_item_3": "숏폼 콘텐츠 병행 제작",
        "result_text": "유튜브 조회수 상승 및 지자체 공식 홍보물로 채택되는 성과를 거두었습니다.",
        "result_item_1": "SNS 누적 조회수 10만 회 달성",
        "result_item_2": "지자체 공식 유튜브 채널 업로드",
        "result_item_3": "관광객들의 긍정적 댓글 반응"
    },
    {
        "filename": "projects/marketing/editorial-design.html",
        "title": "편집 디자인",
        "main_title": "정보와 감성을 전달하는<br>편집 디자인<br>(리플렛, 포스터)",
        "category": "홍보 · 마케팅 / 디자인",
        "image_file": "shinan_island.png",
        "overview_text": "지역 축제, 관광지, 농특산물을 효과적으로 알리기 위한 각종 인쇄물과 시각물을 디자인했습니다.",
        "list_item_1": "축제 포스터 및 리플렛 디자인",
        "list_item_2": "관광 안내지도 일러스트 제작",
        "list_item_3": "농산물 브랜드 로고 및 패키지 디자인",
        "challenge_text": "많은 정보를 담으면서도 가독성을 해치지 않고, 지역의 고유한 색깔을 시각적으로 표현해야 했습니다.",
        "solution_item_1": "인포그래픽을 활용한 정보 시각화",
        "solution_item_2": "따뜻하고 정감 있는 일러스트 스타일 적용",
        "solution_item_3": "통일된 브랜드 아이덴티티 구축",
        "result_text": "지역의 이미지를 세련되게 개선하고 홍보 효과를 극대화했습니다.",
        "result_item_1": "배포된 홍보물의 높은 소장 가치",
        "result_item_2": "지역 브랜드 인지도 상승",
        "result_item_3": "주민들의 디자인 만족도 제고"
    },
    # Consulting
    {
        "filename": "projects/consulting/yangju-rice.html",
        "title": "양주시 쌀교육농장 컨설팅",
        "main_title": "양주시 쌀교육농장<br>프로그램 개발 및<br>운영 컨설팅",
        "category": "컨설팅 / 농촌교육",
        "image_file": "seocheon_farming.png",
        "overview_text": "양주시의 쌀을 주제로 한 교육 농장의 체험 프로그램을 개발하고 운영 전반을 컨설팅했습니다.",
        "list_item_1": "학교 교과 과정과 연계한 프로그램 개발",
        "list_item_2": "교육 환경 조성 및 교구 제작",
        "list_item_3": "강사 역량 강화 교육",
        "challenge_text": "단순 수확 체험을 넘어 쌀의 가치를 교육적으로 전달할 수 있는 심도 있는 프로그램이 필요했습니다.",
        "solution_item_1": "학년별 맞춤형 워크북 개발",
        "solution_item_2": "쌀 요리 및 가공 체험 접목",
        "solution_item_3": "품질 인증 획득 지원",
        "result_text": "교육부 인증 진로 체험처로 선정되었으며 학교 단체 체험객이 증가했습니다.",
        "result_item_1": "농촌교육농장 품질 인증 획득",
        "result_item_2": "연간 체험객 50% 증가",
        "result_item_3": "학교 및 교육청과의 MOU 체결"
    },
    {
        "filename": "projects/consulting/yeoju-aroma.html",
        "title": "여주시 아로마 체험농장 컨설팅",
        "main_title": "여주시 아로마 체험농장<br>치유농업 프로그램<br>컨설팅",
        "category": "컨설팅 / 치유농업",
        "image_file": "shinan_island.png",
        "overview_text": "허브와 아로마를 활용한 치유 프로그램을 개발하여 고부가가치 치유 농장으로의 도약을 지원했습니다.",
        "list_item_1": "치유 농업 프로그램 매뉴얼 개발",
        "list_item_2": "치유 공간(정원, 시설) 조성 자문",
        "list_item_3": "브랜드 스토리텔링 구축",
        "challenge_text": "스트레스 해소와 심신 안정을 원하는 현대인들의 니즈를 충족시킬 전문적인 프로그램이 필요했습니다.",
        "solution_item_1": "오감을 자극하는 테라피 프로그램 구성",
        "solution_item_2": "대상별(직장인, 노인, 청소년) 맞춤 코스 설계",
        "solution_item_3": "감성적인 농장 디자인 개선",
        "result_text": "치유 농업 시범 농장으로 선정되어 웰니스 관광 명소로 자리 잡았습니다.",
        "result_item_1": "치유 프로그램 이용객 만족도 4.8/5.0",
        "result_item_2": "재방문율 증가",
        "result_item_3": "관련 상품(오일, 비누) 매출 증대"
    },
    {
        "filename": "projects/consulting/cheongju-farm.html",
        "title": "청주시 농촌교육농장 컨설팅",
        "main_title": "청주시 농촌교육농장<br>품질 향상 및<br>활성화 컨설팅",
        "category": "컨설팅 / 교육농장",
        "image_file": "seocheon_farming.png",
        "overview_text": "청주시 관내 농촌 교육 농장들의 운영 현황을 진단하고 품질을 높이기 위한 맞춤형 컨설팅을 수행했습니다.",
        "list_item_1": "농장별 심층 진단 및 솔루션 제공",
        "list_item_2": "공동 홍보 마케팅 전략 수립",
        "list_item_3": "안전 및 위생 관리 교육",
        "challenge_text": "농장마다 편차가 큰 프로그램 품질을 상향 평준화하고 통합적인 경쟁력을 갖추는 것이 목표였습니다.",
        "solution_item_1": "우수 농장 벤치마킹 투어",
        "solution_item_2": "전문가 1:1 멘토링 매칭",
        "solution_item_3": "청주시 농촌체험 통합 리플렛 제작",
        "result_text": "참여 농장들의 역량이 강화되고 지역 농촌 체험 관광 생태계가 활성화되었습니다.",
        "result_item_1": "품질 인증 농장 수 증가",
        "result_item_2": "농가 평균 소득 20% 향상",
        "result_item_3": "안전사고 0건 달성"
    }
]

base_path = "f:\\moalab\\gnb"

for proj in projects:
    full_path = os.path.join(base_path, proj["filename"])
    content = template.format(**proj)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Created {full_path}")
