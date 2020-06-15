// Оператор, проверяющий, является ли запуск приложения первым
if (localStorage.getItem('id') == 'null') {         // Если запуск первый то номер следующей транзакции будет равен 1
    let num_transaction = 0;
} else {
    num_transaction = localStorage.getItem('id');   // Если приложение раннее использовалось,
}                                                   // то номер следующей транзакции будет взят из хранилища

// Данные подкатегорий
let subcategories = {
    1: ['Еда и напитки', 'Продукты', 'Фаст-фуд'],
    2: ['Транспорт', 'Общественный транспорт', 'Топливо'],
    3: ['Жилье', 'Коммунальные платежи', 'Аренда'],
    4: ['Покупки', 'Аптека', 'Одежда и обувь', 'Аксессуары'],
    5: ['Досуг', 'Развлечения', 'Хобби', 'Подписки', 'Спорт', 'Отпуск'],
    6: ['Связь', 'Интернет', 'Телефон']
}

// Данные общих сумм трат по категориям
let all_sum = {
    1: [0, 0, 0],
    2: [0, 0, 0],
    3: [0, 0, 0],
    4: [0, 0, 0, 0],
    5: [0, 0, 0, 0, 0, 0],
    6: [0, 0, 0]
}


// Функции, выполняемые при первом и повторном запуске, а также при обновлении страницы

// Функция установки начальной(сегодняшней) даты
function set_date() {
    let date = new Date();          // Получаем сегодняшнюю дату

    let y = date.getFullYear();     // Извлекаем год

    let m = +date.getMonth() + 1;   // Извлекаем месяц
    if (m < 10) {                   // Если он меньше десяти то приписываем в начале 0
        m = '0' + m;
    }

    let d = date.getDate();         // Извлекаем дату
    if (d < 10) {                   // Если она меньше десяти то приписываем в начале 0
        d = '0' + d;
    }

    let day = y + '-' + m + '-' + d;// Форматируем полученные значения под формат input
    in_date.value = day;
}

// Переменные категорий и подкатегорий
let category = document.getElementById('category');         // Переменная select'а категорий затрат
category.onchange = select_category;                        // При смене категории выполняется функция смены подкатегорий
let subcategory = document.getElementById('subcategory');   // Переменная select'а подкатегорий затрат

// Функция установки и смены подкатегории
function select_category() {
    subcategory.innerHTML = '';
    let c = this.value || '1';

    for (let i = 0; i < subcategories[c].length; i++) {
        subcategory.add(new Option(subcategories[c][i], c + i, false, false));
    }
}


// Добавление новой транзакции

// Функция проверки корректности введенной суммы
function check_sum() {
    let sum = +in_sum.value;
    if (!isNaN(sum) && sum != 0 ) {             // Если сумма введена коректно - добавляем операцию в список
        new_transaction();
    } else {                                    // Если сумма введена некоректно - очищаем поле ввода и выводим ошибку
        in_sum.value = '';
        alert('Введите коректное число!');
    }

}

// Функция добавления новой транзакции
function new_transaction() {
    num_transaction++;

    let sel = document.getElementById('subcategory').options.selectedIndex;
    let sel_txt = document.getElementById('subcategory').options[sel].text;
    let sel_value = document.getElementById('subcategory').options[sel].value;

    // Объект транзакции
    let transaction = {
        id: num_transaction,        // ID
        sum: +in_sum.value,         // Потраченная сумма
        subcateg_value: sel_value,  // ID подкатегории
        subcateg_name: sel_txt,     // Подкатегория
        date: in_date.value,
        comment: in_comment.value   // Коментарий
    }

    // Добавление новой транзакции в список
    display_transaction(transaction);

    // Добавление данных о новой транзакции в статистику
    display_statistics(transaction);

    // Запись новой транзакции и ее ID в локальное хранилище
    localStorage.setItem('id', num_transaction);
    localStorage.setItem(num_transaction, JSON.stringify(transaction));

    // Очистка полей ввода
    in_sum.value = '';
    in_comment.value = '';

    remove();
}


// Функции, выполняемые при добавлении новой транзакции: отображение списка транзакций и статистики

// Переменные элементов блока транзакций и статистики
let element_list;
let element_name;
let element_info;
let new_div;
let text_div;

// Переменная списка транзакций
let ulist_trans = document.getElementById('trans_list');

//Функция добавления транзакции в список
function display_transaction(obj) {
    element_list = document.createElement('div');       // Добавление элемента div: транзакция
    element_list.className = 'list_card transaction_card';
    element_list.id = 'tr' + obj.id;

    element_name = document.createElement('div');       // Добавление div: подкатегория и комментарий
    element_name.className = 'transaction_name';

    new_div = document.createElement('div');            // Добавление div: подкатегория
    new_div.className = 'transaction_subcateg';         //
    text_div = document.createTextNode(obj.subcateg_name);
    new_div.appendChild(text_div);
    element_name.appendChild(new_div);

    new_div = document.createElement('div');            // Добавление div: комментарий
    new_div.className = 'transaction_comment';          //
    text_div = document.createTextNode(obj.comment);
    new_div.appendChild(text_div);
    element_name.appendChild(new_div);

    element_list.appendChild(element_name);             // Добавление подкатегории и комментария в блок транзакции

    element_info = document.createElement('div');       // Добавление div: сумма и дата
    element_info.className = 'transaction_info';

    new_div = document.createElement('div');            // Добавление элемента div: сумма
    new_div.className = 'transaction_sum';              //
    text_div = document.createTextNode('- ' + obj.sum.toFixed(2) + ' ₽');
    new_div.appendChild(text_div);  
    element_info.appendChild(new_div);

    new_div = document.createElement('div');            // Добавление элемента div: сумма
    new_div.className = 'transaction_date';             //
    let new_date = (obj.date).slice(8) + '.' + (obj.date).slice(5, 7);
    text_div = document.createTextNode(new_date);
    new_div.appendChild(text_div);  
    element_info.appendChild(new_div);

    element_list.appendChild(element_info);             // Добавление суммы и даты в блок транзакции

    new_div = document.createElement('div');            // Добавление элемента div: крестик для удаления транзакции
    new_div.className = 'transaction_remove';
    text_div = document.createTextNode('✖');
    new_div.appendChild(text_div);
    element_list.appendChild(new_div);

    ulist_trans.insertBefore(element_list, ulist_trans.firstChild); // Добавление транзакции в список транзакций
}

// Переменная списка статистики
let ulist_stat = document.getElementById('stat_list');

// Функция вывода статистики
function display_statistics(obj) {
    let i = Math.floor(obj.subcateg_value / 10);
    let j = obj.subcateg_value % 10;
    let id_div = obj.subcateg_value;

    if (all_sum[i][j] == 0) {                               // Если раннее трат по данной подкатегории не было,
        all_sum[i][j] += obj.sum;                           // то добавляем блок статистики по этой подкатегории

        element_list = document.createElement('div');
        element_list.className = 'list_card statistics_card';

        let new_div = document.createElement('div');
        new_div.className = 'statistics_subcoteg';
        let text_div = document.createTextNode(`${obj.subcateg_name}:`);
        new_div.appendChild(text_div);
        element_list.appendChild(new_div);

        new_div = document.createElement('div');
        new_div.className = 'statistics_sum';
        new_div.id = id_div;
        text_div = document.createTextNode(`${obj.sum.toFixed(2)} ₽`);
        new_div.appendChild(text_div);
        element_list.appendChild(new_div);

        ulist_stat.appendChild(element_list);               // Добавляем блок подкатегории в общую статистику
    } else {                                                // Если траты по подкатегории были раннее и ее соответствующий блок добавлен,
        all_sum[i][j] += obj.sum;                           // то прибавляем к общей сумме сумму новой транзакции
        let stat_div = document.getElementById(id_div);
        let new_sum =  +stat_div.textContent.slice(0, -2) + obj.sum;
        stat_div.textContent = new_sum.toFixed(2) + ' ₽';
    }
}


// Функции, выполняемые при повторном запуске или обновлении страницы

// Функция вывовда последних транзакций
function show_transactions() {
    for (let i = 1; i <= +localStorage.getItem('id'); i++) {    // Перебор всех транзакций
        let trans = JSON.parse(localStorage.getItem(i));        // Объкт транзакции, загруженный из хранилища

        display_transaction(trans);
    }
}

// Функция вывода статистики
function show_statistics() {
    for (let i = 1; i <= +localStorage.getItem('id'); i++) {    // Перебор всех транзакций
        let trans = JSON.parse(localStorage.getItem(i));        // Объкт транзакции, загруженный из хранилища

        display_statistics(trans);
    }

    if (localStorage.getItem('id') != null && localStorage.getItem('id') != 0) {
        stat_sort();
    }
}

// Функция сортировки статистики
function stat_sort() {
    let stat_list = document.querySelectorAll('div.statistics_card');
    let cards = [];
    let parent = stat_list[0].parentNode;

    for (let i = 0; i < stat_list.length; i++) {            // Добавляем в массив все данные по статистике
      cards.push(parent.removeChild(stat_list[i]));
    }

    cards.sort(function(nodeA, nodeB) {                     // Сортировка
        let text_a = nodeA.querySelector('div:nth-child(2)').textContent;
        let text_b = nodeB.querySelector('div:nth-child(2)').textContent;
        let number_a = parseInt(text_a);
        let number_b = parseInt(text_b);
        if (number_a > number_b) return -1;
        if (number_a < number_b) return 1;
        return 0;
      })
      .forEach(function(node) {
        parent.appendChild(node)
      });
}


// Функция удаления записи операции из списка транзакций и данных о этой операции из списка статистики
function remove() {
    var c = document.querySelectorAll("div.transaction_remove");
    Array.prototype.forEach.call(c, function (a) {
        a.onclick = function () {
            var b = a.parentNode;
            let id = +(b.id).substr(2);

            localStorage.removeItem(id);                        // Удаление данных по транзакции из хранилища
            for (let i = id + 1; i <= num_transaction; i++) {
                let trans = JSON.parse(localStorage.getItem(i));
                trans.id = trans.id - 1;
                localStorage.setItem(id, JSON.stringify(trans))
            }
            localStorage.removeItem(num_transaction);
            num_transaction--;
            localStorage.setItem('id', num_transaction)
            b.parentNode.removeChild(b);

            while (ulist_stat.firstChild) {
                ulist_stat.removeChild(ulist_stat.firstChild);
            }
            
            all_sum = {
                1: [0, 0, 0],
                2: [0, 0, 0],
                3: [0, 0, 0],
                4: [0, 0, 0, 0],
                5: [0, 0, 0, 0, 0, 0],
                6: [0, 0, 0]
            }

            show_statistics();
        }
    })
}


// Функции проверок наличия данных

// Функция проверки наличия данных по тратам
function check_trans() {
    if (localStorage.getItem('id') != null && localStorage.getItem('id') != 0) {
        empty();
    } else {
        alert('По тратам нет данных!');
    }
}

// Функция проверки наличия данных по статистике расходов
function check_sort() {
    if (localStorage.getItem('id') != null && localStorage.getItem('id') != 0) {
        stat_sort();
    } else {
        alert('По тратам нет данных!');
    }
}


// Функция удаления всех данных из хранилища
function empty() {

    if (confirm('Все данные будут удалены! Продолжить?')) {
        while (ulist_trans.firstChild) {                    // Очистка списка транзакций
            ulist_trans.removeChild(ulist_trans.firstChild);
        }

        while (ulist_stat.firstChild) {                     // Очистка списка статистики
            ulist_stat.removeChild(ulist_stat.firstChild);
        }

        localStorage.clear();                               // Очистка локального хранилища и данных по общим саммам трат
        num_transaction = 0;
        all_sum = {
            1: [0, 0, 0],
            2: [0, 0, 0],
            3: [0, 0, 0],
            4: [0, 0, 0, 0],
            5: [0, 0, 0, 0, 0, 0],
            6: [0, 0, 0]
        }
    }
}

// Функции, выполняемые при полной загрузке страницы: установка даты, отображение подкатегорий, последних операций и статистики
window.onload = set_date(), select_category(), show_transactions(), show_statistics(), remove();