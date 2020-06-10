// Оператор, проверяющий, является ли запуск приложения первым
if (localStorage.getItem('id') == 'null') {
    let num_trunsition = 0;                         // Если запуск первый то номер следующей транзакции будет равен 1
} else {
    num_trunsition = localStorage.getItem('id');    // Если приложение раннее использовалось,
}                                                   // то номер следующей транзакции будет взят из хранилища

// Данные подкатегорий
let subcategories = {
    food: ['Продукты', 'Фаст-фуд'],
    transport: ['Общественный транспорт', 'Топливо'],
    buy: ['Одежда и обувь', 'Красота и здоровье']
}

var category = document.getElementById('category');         // Переменная select'а категорий затрат
category.onchange = select_category;                        // При смене категории выполняется функция смены подкатегорий
var subcategory = document.getElementById('subcategory');   // Переменная select'а подкатегорий затрат

// Функция смены подкатегорий
function select_category() {
    subcategory.innerHTML = '';
    let c = this.value || 'food';

    for (let i = 0; i < subcategories[c].length; i++) {
        subcategory.add(new Option(subcategories[c][i], c + i, false, false));
    }
}

// Переменная списка транзакций
let ulist = document.getElementById('ul');

// Функция добавления новой транзакции
function new_transition() {
    num_trunsition++;           

    let sel = document.getElementById('subcategory').options.selectedIndex;
    let txt = document.getElementById('subcategory').options[sel].text;

    // Объект транзакции
    let transition = {
        id: num_trunsition,         // ID
        sum: +in_sum.value,         // Потраченная сумма
        subcateg: txt,              // Подкатегория
        comment: in_comment.value   // Коментарий
    }

    // Добавление новой транзакции в список
    let element_li = document.createElement('li');      // Переменная элемента списка
    let text_li = document.createTextNode(`${transition.sum}\t${transition.subcateg}\t${transition.comment}`);
    element_li.appendChild(text_li);
    ulist.insertBefore(element_li, ulist.firstChild);   // Непосредственно добавление нового элемента списка

    // Запись новой транзакции и ее ID в локальное хранилище
    localStorage.setItem('id', num_trunsition);
    localStorage.setItem(num_trunsition, JSON.stringify(transition));

    // Очистка полей ввода
    in_sum.value = '';
    in_comment.value = '';
}

// Функция удаления данных
function empty() {
    while (ulist.firstChild) {                  // Очистка списка транзакций
        ulist.removeChild(ulist.firstChild);
    }
    localStorage.clear();                       // Очистка локального хранилища
}

// Функция вывовда последних транзакций
function show_transitions() {

    for (let i = +localStorage.getItem('id'); i >= 1; i--) {
        let trans = JSON.parse(localStorage.getItem(i));    // Объкт транзакции, загруженный из хранилища
        
        let element_li = document.createElement('li');
        let text_li = document.createTextNode(`${trans.sum}\t${trans.subcateg}\t${trans.comment}`);
        element_li.appendChild(text_li);
        ulist.appendChild(element_li);
    }
}

// Функции, выполняемые при полной загрузке страницы: отображение подкатегорий и последних операций
window.onload = select_category(), show_transitions();

//