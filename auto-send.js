// сюда айдишку не забудь закинуть

const ResumeId = `#resume_${'ВАШ_АЙДИ_РЕЗЮМЕ'}`

// сопроводительное письмо

const getFrontendCoverMessage = (vacancyName) => `Добрый день!

Обратил внимание на вашу вакансию ${vacancyName}.  
`

// Пауза
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function init() {
  const vacancies = document.querySelectorAll('[data-qa="vacancy-serp__vacancy_response"]');
  const vacancy = document.querySelector('[data-qa="vacancy-response-link-top"]');
  let i = 0;
  
  // Функция для автоматического выбора резюме
  function selectResume() {
    const resume = document.querySelector(ResumeId);
    const message = document.querySelector('[data-qa="vacancy-response-letter-toggle"]');

    if (resume) {
      resume.click();
      if (message) {
        message.click();
      }
    }
  }

  // Функция для автоматической отправки сопроводительного письма
  function handlerCoverLetter() {
    // Шаблон сопроводительного письма
    const vacancyTitleElement = document.querySelector('.bloko-modal-header_outlined > div');
    if (!vacancyTitleElement) return;

    const vacancyTitle = vacancyTitleElement.textContent;
    const vacancyName = vacancyTitle.slice(1, vacancyTitle.length - 1);
    const frontendCoverMessage = getFrontendCoverMessage(vacancyName)
// Сообщения по резюме
    const messagesData = {
      frontend: frontendCoverMessage,
    };

    const messageArea = document.querySelector(
      '[data-qa="vacancy-response-popup-form-letter-input"]'
    );
    if (messageArea) {
      messageArea.value = messagesData.frontend;

      // Добавить изменения в поле текста
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      messageArea.dispatchEvent(evt);

      // Отправить отклик
      const btnSubmit = document.querySelector('[data-qa="vacancy-response-submit-popup"]');
      if (btnSubmit) btnSubmit.click();
    }
  }

  // Вызвать функцию на странице с вакансией
  if (vacancy) {
    vacancy.click();
    
    await delay(1000)
    // Если есть сообщение об релокации, подтверждаем его
    hasRelocationTitleWarning() && confirmClickRelocation()
    
    await delay(1000);
    selectResume();

    await delay(500);
    handlerCoverLetter();
  }
  // Иначе вызвать функцию на странице со списком вакансий
  else {
    while (i < vacancies.length) {
      vacancies[i+1].click();

      await delay(1000);
      selectResume();

      await delay(500);
      handlerCoverLetter();
      i+=2;

      await delay(1000);
    }
  }
}

function hasRelocationTitleWarning() {
  return !!document.querySelector('[data-qa="relocation-warning-title"]')
}

function confirmClickRelocation() {
  const btnSubmit = document.querySelector(
    '[data-qa="relocation-warning-confirm"]'
  )

  btnSubmit.click()
}

// Добавить на панель доп. функционал
(async function addNavLinks() {
  await delay(1000);

  const navLinks = document.querySelectorAll(
    '.supernova-navi-item.supernova-navi-item_lvl-2.supernova-navi-item_no-mobile'
  );

  if (navLinks.length > 2) {
    const itemLetters = document.createElement('div');

    function createElement(item, attribute, title) {
      item.classList.add(
        'supernova-navi-item',
        'supernova-navi-item_lvl-2',
        'supernova-navi-item_no-mobile'
      );

      item.innerHTML = `
      <a
        data-qa="mainmenu_vacancyResponses"
        class="supernova-link"
        ${attribute}
      >
        ${title}
      </a>
      <div class="supernova-navi-underline">${title}</div>
      `;
    }

    createElement(itemLetters, 'handler-letters', 'Отправить отклики');

    navLinks[2].append(itemLetters);
    document.querySelector('[handler-letters]').addEventListener('click', init);
  }
})();
