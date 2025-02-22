const ruTranslations = {
  landing_title: 'Добро пожаловать в TaskNote',
  landing_subtitle: 'Ваш лучший помощник для заметок и задач!',
  landing_btn_login: 'Войти',
  landing_btn_register: 'Зарегистрироваться',
  landing_btn_english: 'English',
  landing_btn_portuguese: 'Português do Brasil',
  landing_btn_spanish: 'Español',
  landing_btn_russian: 'Русский',

  login_title: 'Войти',
  login_email_label: 'Электронная почта',
  login_email_placeholder: 'Введите вашу электронную почту',
  login_password_label: 'Пароль',
  login_password_placeholder: 'Введите ваш пароль',
  login_btn_submit: 'Войти',
  login_account: 'Ещё нет аккаунта?',
  login_go_other: 'Создать аккаунт',
  login_back_home: 'Вернуться на главную',

  register_title: 'Создать аккаунт',
  register_email_label: 'Электронная почта',
  register_email_placeholder: 'Введите вашу электронную почту',
  register_password_label: 'Пароль',
  register_password_placeholder: 'Введите ваш пароль',
  register_btn_submit: 'Создать аккаунт',
  register_account: 'Уже есть аккаунт?',
  register_go_other: 'Войти',
  register_back_home: 'Вернуться на главную',

  home_nav_home: 'Главная',
  home_nav_tasks: 'Задачи',
  home_nav_notes: 'Заметки',
  home_nav_about: 'О приложении',
  home_welcome_title: 'Привет, ',
  home_card_task_title: 'Обзор задач',
  home_card_task_pending: 'Незавершённые задачи',
  home_card_task_empty: 'Нет незавершённых задач',
  home_card_task_done: 'выполненные задачи!',
  home_card_task_done_empty: 'Нет выполненных задач!',
  home_card_task_btn: 'Перейти к задачам',
  home_card_note_title: 'Обзор заметок',
  home_card_note_count: 'Примечания',
  home_card_note_btn: 'Перейти к заметкам',
  home_card_search_label: 'Искать задачи и заметки',
  home_card_search_placeholder: 'Введите запрос',
  home_card_search_btn: 'Искать',
  home_card_search_result_label: 'Результаты поиска',
  home_card_search_empty_result: 'Нет результатов',

  task_form_title: 'Добавить задачу',
  task_form_desc_label: 'Описание',
  task_form_desc_placeholder: 'Введите описание задачи',
  task_form_url_label: 'URL',
  task_form_url_placeholder: 'URL-адрес (необязательно)',
  task_form_duedate_label: 'Срок оплаты',
  task_form_duedate_placeholder: 'Срок выполнения (необязательно)',
  task_form_submit: 'Сохранить задачу',
  task_table_description: 'Описание',
  task_table_done: 'Завершённый',
  task_table_actions: 'Действия',
  task_table_action_done: 'Завершённый',
  task_table_action_undone: 'Отменено',
  task_table_action_done_yes: 'Да',
  task_table_action_done_no: 'Нет',
  task_table_action_edit: 'Редактировать',
  task_table_action_delete: 'Удалить',

  note_form_title: 'Добавить примечание',
  note_form_title_label: 'Заголовок',
  note_form_title_placeholder: 'Введите название заметки',
  note_form_content_label: 'Примечание к содержанию',
  note_form_content_placeholder: 'Введите содержание заметки',
  note_form_submit: 'Сохранить заметку',
  note_table_btn_edit: 'Редактировать',
  note_table_btn_delete: 'Удалить',

  about_app_title: 'О TaskNote',
  about_app_description: `TaskNote — это ваше приложение для управления
    задачами и заметками в одном удобном месте. Независимо от того, отслеживаете ли вы
    ежедневные задачи или организуете заметки с важных встреч, TaskNote помогает
    вам оставаться организованными и продуктивными.`,
  about_app_features: 'Функции',
  about_app_features_one: 'Быстро добавляйте и управляйте задачами и заметками',
  about_app_features_two: 'Поиск и фильтрация заметок для легкого доступа',
  about_app_features_three: 'Интуитивно понятный пользовательский интерфейс',
  about_app_help_title: 'Помощь и как использовать',
  about_app_help_description: `Чтобы начать, просто зарегистрируйтесь или войдите в систему, и
    вы получите доступ к своей персонализированной панели. Оттуда вы можете
    создавать, редактировать и удалять задачи и заметки, а также организовывать их так, как вам
    нравится. Нужна помощь? Посетите нашу страницу «Справка» (в будущем) для получения руководств
    и часто задаваемых вопросов.`,

  about_tech_title: 'Технологии',
  about_tech_description: `TaskNote был создан с использованием современных веб-технологий, 
      которые обеспечивают скорость, надежность и безопасность.`,
  about_tech_list_one: 'React с TypeScript для фронтенда',
  about_tech_list_two: 'Bootstrap 5 для компонентов и адаптивного дизайна',
  about_tech_list_three: 'Java и Spring Boot плюс GraalVM для бэкенда и Cloud Native',
  about_tech_list_four: 'PostgreSQL для управления базами данных',
  about_tech_list_five: 'Docker для контейнеризации и развертывания',
  about_tech_list_six: 'GitHub Actions для CI/CD, тестирования и принудительного линтинга',
  about_tech_list_seven: 'SonarCloud и GitHub QL для проверок безопасности и улучшений',

  about_dev_title: 'О разработчике',
  about_dev_description: `Привет! Я Рикардо, разработчик TaskNote. Я увлечен созданием приложений,
    которые делают жизнь проще и более
    организованной. Вы можете связаться со мной по адресу `,
  about_dev_description_two: ' для любых вопросов или отзывов.',

  account_my_account_tittle: 'Мой аккаунт',
  account_my_account_hello: 'Привет! Здесь вы можете управлять своими предпочтениями.',
  account_my_account_logged: 'Вы вошли как:',
  account_app_lang_tittle: 'Язык приложения',
  account_app_lang_description: 'Вы можете выбрать один из этих языков:',
  account_privacy_little: 'Ваша конфиденциальность имеет значение',
  account_privacy_text: `Мы стремимся защищать вашу конфиденциальность и
    предоставлять вам полный контроль над вашими данными. Вы можете запросить полное удаление
    аккаунта в любое время. После обработки вся ваша личная информация будет
    навсегда удалена с наших серверов.`,
  account_privacy_delete_btn: 'Удалить все мои данные',
  account_delete_tittle: 'Вы собираетесь удалить свой аккаунт!',
  account_delete_description: `Это действие нельзя отменить. Если вы действительно хотите
    удалить все свои данные, нажмите кнопку ниже. Если нет, закройте это сообщение, и ваши
    данные будут в безопасности.`,
  account_delete_btn: 'Да, удалить все',

  footer_my_account: 'Мой аккаунт ',

  logout: 'Выйти'
};

export default ruTranslations;
