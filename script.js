if (localStorage.getItem('id') == 'null') {
    let num_trunsition = 0;
} else {
    num_trunsition = localStorage.getItem('id');
}


function new_transition() {
    num_trunsition++;

    let transition = {
        id: num_trunsition,
        comment: in_comment.value,
        sum: +in_sum.value
    }

    localStorage.setItem('id', num_trunsition);
    localStorage.setItem(num_trunsition, JSON.stringify(transition));
}

function show_transitions() {
    let trans = JSON.parse(localStorage.getItem(num_trunsition));
    out.value = `${trans.comment}\t${trans.sum}`;
}