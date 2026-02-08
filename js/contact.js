
const contactForm = document.querySelector('form.text-section'); // Assuming the form class in contact.html

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        
        // 1. Get Values
        const contactInput = contactForm.querySelector('input[type="text"]');
        const messageInput = contactForm.querySelector('textarea');
        
        const contactValue = contactInput.value.trim();
        const messageValue = messageInput.value.trim();
        
        // 2. Simple Validation
        if (!contactValue || !messageValue) {
            alert('이메일/연락처와 내용을 모두 입력해주세요.');
            return;
        }

        // 3. Prepare Data
        const formData = new FormData();
        formData.append('contact', contactValue);
        formData.append('message', messageValue);
        formData.append('_subject', 'GNB Planning 홈페이지 문의 (Contact)');

        // 4. Submit to Formspree
        submitBtn.disabled = true;
        submitBtn.innerText = "전송 중...";
        
        try {
            // *** 중요 ***
            // happyfac@naver.com으로 메일을 받으려면:
            // 1. https://formspree.io/ 사이트에 접속해 회원가입/로그인 합니다.
            // 2. 'New Form'을 생성하고 'Send emails to'에 'happyfac@naver.com'을 입력합니다.
            // 3. 생성된 Form의 ID (예: xnqbkqzj)를 아래 URL의 'YOUR_FORM_ID' 부분에 붙여넣으세요.
            const formId = "maqdykga"; 
            const url = `https://formspree.io/f/${formId}`;

            // Check if user set the ID
            if (formId === "YOUR_FORM_ID") {
                // Simulation for demo purposes if ID is not set
                await new Promise(r => setTimeout(r, 1500));
                
                // Show instruction to user
                alert(`[설정 필요] 메일 전송을 위해 코드를 연결해야 합니다.\n\n1. Formspree.io 가입\n2. happyfac@naver.com 입력 후 폼 생성\n3. js/contact.js 파일의 YOUR_FORM_ID 수정\n\n(지금은 전송 완료 화면만 보여집니다)`);
                
                // Simulate success
                contactForm.reset();
                submitBtn.innerText = "전송 완료!";
                setTimeout(() => { submitBtn.innerText = originalBtnText; submitBtn.disabled = false; }, 3000);
                return;
            }

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('소중한 이야기가 전달되었습니다. 검토 후 연락드리겠습니다.');
                contactForm.reset();
                submitBtn.innerText = "전송 완료";
            } else {
                alert('전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다. 이메일(contact@gnbplanning.co.kr)로 직접 연락 부탁드립니다.');
        } finally {
            if (submitBtn.innerText !== "전송 완료!" && submitBtn.innerText !== "전송 완료") {
                 submitBtn.disabled = false;
                 submitBtn.innerText = originalBtnText;
            } else {
                 setTimeout(() => { 
                     submitBtn.disabled = false; 
                     submitBtn.innerText = originalBtnText; 
                 }, 3000);
            }
        }
    });
}
