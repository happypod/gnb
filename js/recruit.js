
const form = document.getElementById('applyForm');
const statusDiv = document.getElementById('formStatus');

if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
    
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      
      // Disable button during submission
      submitBtn.disabled = true;
      submitBtn.innerText = "제출 중...";
    
      try {
        // *** 중요 ***
        // happyfac@naver.com으로 지원서를 받으려면:
        // 1. https://formspree.io/ 접속 -> New Form 생성
        // 2. target email에 happyfac@naver.com 설정
        // 3. 발급받은 Form ID를 아래 "YOUR_FORM_ID"에 입력하세요.
        const formId = "maqdykga"; 
        const formUrl = `https://formspree.io/f/${formId}`; 
        
        let res;
        
        // Demo/Safety Check: If ID is not set, simulate success or alert
        if (formId === "YOUR_FORM_ID") {
             // Simulate network request
             await new Promise(resolve => setTimeout(resolve, 1500));
             
             // Alert for Setup
             alert(`[설정 필요] 지원서 전송을 위해 설정이 필요합니다.\n\njs/recruit.js 파일에서 YOUR_FORM_ID를 교체해주세요.\n(입력하신 데이터는 전송되지 않았습니다)`);
             
             res = { ok: true }; // Fake success to clear form for UX demo
        } else {
             res = await fetch(formUrl, {
              method: 'POST',
              body: formData,
              headers: {
                'Accept': 'application/json'
              }
            });
        }
    
        if (res.ok) {
          statusDiv.className = 'success';
          statusDiv.textContent = '지원이 성공적으로 제출되었습니다. 꼼꼼히 검토 후 연락드리겠습니다.';
          form.reset();
        } else {
          statusDiv.className = 'error';
          statusDiv.textContent = '제출 중 오류가 발생했습니다. 다시 시도해 주시거나 happyfac@naver.com으로 직접 제출 부탁드립니다.';
        }
      } catch (err) {
        statusDiv.className = 'error';
        statusDiv.textContent = '서버 연결 중 오류가 발생했습니다. happyfac@naver.com으로 직접 연락주세요.';
        console.error(err);
      } finally {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
      }
    });
}
