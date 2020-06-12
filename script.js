// Оператор, проверяющий, является ли запуск приложения первым
if (localStorage.getItem('id') == 'null') {
    let num_transaction = 0;                        // Если запуск первый то номер следующей транзакции будет равен 1
} else {
    num_transaction = localStorage.getItem('id');   // Если приложение раннее использовалось,
}                                                   // то номер следующей транзакции будет взят из хранилища

// Данные подкатегорий
let subcategories = {
    1: ['Продукты', 'Фаст-фуд'],
    2: ['Общественный транспорт', 'Топливо'],
    3: ['Одежда и обувь', 'Красота и здоровье']
}

// Данные общих сумм трат по категориям
let all_sum = {
    1: [0, 0],
    2: [0, 0],
    3: [0, 0]
}

let category = document.getElementById('category');         // Переменная select'а категорий затрат
category.onchange = select_category;                        // При смене категории выполняется функция смены подкатегорий
let subcategory = document.getElementById('subcategory');   // Переменная select'а подкатегорий затрат

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

// Функция смены подкатегорий
function select_category() {
    subcategory.innerHTML = '';
    let c = this.value || '1';

    for (let i = 0; i < subcategories[c].length; i++) {
        subcategory.add(new Option(subcategories[c][i], c + i, false, false));
    }
}

// Функция проверки карректности введенной суммы
function check_sum() {
    let sum = +in_sum.value;
    if (!isNaN(sum) && sum != 0 ) {
        new_transaction();
    } else {
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

// Функции вывовда последних транзакций и статистики
function show_transactions() {
    for (let i = 1; i <= +localStorage.getItem('id'); i++) {    // Перебор всех транзакций
        let trans = JSON.parse(localStorage.getItem(i));        // Объкт транзакции, загруженный из хранилища

        display_transaction(trans);
    }
}

function show_statistics() {
    for (let i = 1; i <= +localStorage.getItem('id'); i++) {    // Перебор всех транзакций
        let trans = JSON.parse(localStorage.getItem(i));        // Объкт транзакции, загруженный из хранилища

        display_statistics(trans);
    }

    if (localStorage.getItem('id') == 'null') {
        stat_sort();
    }
}



// Переменная списка транзакций
let ulist_trans = document.getElementById('trans_list');
// 
let element_list;
let element_name;
let element_info;
let new_div;
let text_div;

//Функция добавления транзакции в список
function display_transaction(obj) {
    element_list = document.createElement('div');       // Добавление элемента div: транзакция
    element_list.className = 'transaction_card';        //
    element_list.id = 'tr' + obj.id;

    element_name = document.createElement('div');       // Добавление div: подкатегория и коментарий
    element_name.className = 'transaction_name';

    new_div = document.createElement('div');            // Добавление div: подкатегория
    new_div.className = 'transaction_subcateg';         //
    text_div = document.createTextNode(obj.subcateg_name);
    new_div.appendChild(text_div);
    element_name.appendChild(new_div);

    new_div = document.createElement('div');            // Добавление div: коментарий
    new_div.className = 'transaction_comment';          //
    text_div = document.createTextNode(obj.comment);
    new_div.appendChild(text_div);
    element_name.appendChild(new_div);

    element_list.appendChild(element_name);             // Добавление подкатегории и коментария в блок транзакции

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

    new_div = document.createElement('div');
    new_div.className = 'transaction_remove';
    text_div = document.createTextNode('✖');
    new_div.appendChild(text_div);
    element_list.appendChild(new_div);

    ulist_trans.insertBefore(element_list, ulist_trans.firstChild); // Добавление транзакции в список транзакций
}

// Переменная блока статистики
let ulist_stat = document.getElementById('stat_list');

// Функция вывода статистики
function display_statistics(obj) {
    let i = Math.floor(obj.subcateg_value / 10);
    let j = obj.subcateg_value % 10;
    let id_div = obj.subcateg_value;

    if (all_sum[i][j] == 0) {                               // Если раннее трат по данной подкатегории не было,
        all_sum[i][j] += obj.sum;                           // то добавляем блок статистики по этой подкатегории

        element_list = document.createElement('div');
        element_list.className = 'statistics_card';

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

// Функция проверки наличия статистики расходов
function check_sort() {
    if (localStorage.getItem('id') != null && localStorage.getItem('id') != 0) {
        stat_sort();
    } else {
        alert('По статистике расходов нет данных!');
    }
}

// Функция сортировки статистики
function stat_sort() {
    let stat_list = document.querySelectorAll('div.statistics_card');
    let cards = [];
    let parent = stat_list[0].parentNode;

    for (let i = 0; i < stat_list.length; i++) {    
      cards.push(parent.removeChild(stat_list[i]));
    }

    cards.sort(function(nodeA, nodeB) {
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


// Функция удаления записи
function remove() {
    var c = document.querySelectorAll("div.transaction_remove");
    Array.prototype.forEach.call(c, function (a) {
        a.onclick = function () {
            var b = a.parentNode;
            let id = +(b.id).substr(2);

            localStorage.removeItem(id);
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
                1: [0, 0],
                2: [0, 0],
                3: [0, 0]
            }

            show_statistics();
        }
    })
}


// Функция удаления данных
function empty() {
    while (ulist_trans.firstChild) {                    // Очистка списка транзакций
        ulist_trans.removeChild(ulist_trans.firstChild);
    }

    while (ulist_stat.firstChild) {
        ulist_stat.removeChild(ulist_stat.firstChild);
    }

    localStorage.clear();                               // Очистка локального хранилища
    num_transaction = 0;
}

// Функции, выполняемые при полной загрузке страницы: отображение подкатегорий и последних операций
window.onload = set_date(), select_category(), show_transactions(), show_statistics(), remove();

//