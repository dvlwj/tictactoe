// JavaScript Document
$(document).ready(function () {
    // global variable
    player_turn = "x"
    cell_size = 0
    x = "x"
    o = "o"
    count = 0;
    o_win = 0;
    x_win = 0;
    x_score = 0
    o_score = 0
    array_master = []
    array_win_combos = []
    o_array = []
    x_array = []

    // set text based on language dictionary
    $('.app_name').text(lang.app_name)
    $('#player_turn_info').text(lang.x_turn)
    $('#panel-start-game .panel-title').text(lang.ready_to_play)
    $('#panel-start-game .btn-primary').text(lang.yes)
    $('#panel-start-game .btn-danger').text(lang.no)
    $('#modal_cell .title').text(lang.insert_scale)
    $('#modal_cell .cell_label').text(lang.how_many_cell)
    $('#cell_count_warning').text(lang.cell_count_warning)
    $('#restart_button').text(lang.restart_game)

    //  utility function for game menu

    // start game form (fill number of cell player want)
    $('#modal_cell .btn-primary').click(function () {
        if (!$('#cell_count').val()) {
            alert(lang.error_empty)
        } else {
            createGameBoard($('#cell_count').val())
            cell_size = $('#cell_count').val()
            $('#modal_cell').modal('toggle')
            $('#panel-start-game').hide()
            $('#tic-tac-toe').show()
        }
    })

    // check if cell_count more than 100
    $("#cell_count").keyup(function () {
        if ($('#cell_count').val() > 100) {
            $('#cell_count_warning').show()
        } else {
            $('#cell_count_warning').hide()
        }
    })

    // call start game form's modal
    $('#panel-start-game .btn-primary').click(function () {
        $('#panel-start-game').hide()
        $('#modal_cell').modal({
            backdrop: 'static',
            keyboard: 'false'
        }).css("top", "30%")
        // $('#tic-tac-toe').show()
    })

    // condition when user click not ready in game menu
    $('#panel-start-game .btn-danger').click(function () {
        $('#panel-start-game .btn-primary').hide()
        $('#panel-start-game .btn-danger').hide()
        $('#panel-start-game .panel-heading').hide()
        $('#panel-start-game .panel-body').text(lang.refresh_to_play)
    })

    // condition when user click ready in game menu
    $('#modal_cell .btn-default').click(function () {
        $('#modal_cell').modal('toggle')
        $('#panel-start-game').show()
    })

    // restart button function
    $('#restart_button').click(function () {
        location.reload()
    })

    // Game's logic

    // create game board
    function createGameBoard(cell_size) {
        let cell_count = 0
        for (let index = 0; index < cell_size; index++) {
            var tr = document.createElement("tr")
            tr.className = 'row_' + (index + 1)
            for (var index1 = 0; index1 < cell_size; index1++) {
                var td = document.createElement("td")
                td.id = cell_count
                cell_count += 1
                td.className = "board_cell unchosen"
                td.setAttribute('onclick', 'cellCheck("' + td.id + '");')
                tr.appendChild(td)
            }
            $('#game_board_table').append(tr)
        }
        createArrayMaster(cell_size)
    }

    // create array master (mapping for gameboard)
    function createArrayMaster(cell_size) {
        array_master = Array.from({
            length: cell_size * cell_size
        }, (v, k) => k)
        indexArrayWinCondition(cell_size)
    }

    // collect all array winning condition to one array list for winning
    function indexArrayWinCondition(cell_size) {
        for (let index = 0; index < cell_size; index++) {
            array_win_combos.push(horizontal(cell_size)[index])
        }
        for (let index = 0; index < cell_size; index++) {
            array_win_combos.push(vertical(cell_size)[index])
        }
        array_win_combos.push(diagonal1(cell_size), diagonal2(cell_size))
        console.log(array_win_combos)
    }

    // create array list for horizontal winning condition
    function horizontal(cell_size) {
        let result = []
        let arr = array_master.slice(0)
        while (arr.length) {
            result.push(arr.splice(0, cell_size))
        }
        return result
    }

    // create array list for vertical winning condition
    function vertical(cell_size) {
        return horizontal(cell_size)[0].map((col, i) => horizontal(cell_size).map(row => row[i]))
    }

    // create array list for diagonal top left to bottom right winning condition
    function diagonal1(cell_size) {
        /*
        return disini horizontal(cell_size)[x][y]
        dimana [x] adalah array pertama , y adalah dimensi array didalamnya
        dimana ini dilooping sampai array pertama = (cell_size - 1)
        contohnya adalah cell_size = 3 maka dilooping menjaid [0][0],[1][1],[2][2]
        lalu jika cell_size =4 maka dilooping menjadi [0][0],[1][1],[2][2],[3][3]
        */
        var arr = []
        for (let index = 0; index < (cell_size); index++) {
            arr.push(horizontal(cell_size)[index][index])
        }
        return arr
    }

    // create array list for diagonal bottom left to top right winning condition
    function diagonal2(cell_size) {
        /*
        return disini horizontal(cell_size)[x][y]
        dimana [x] adalah array terakhir , y adalah dimensi terakhir array didalamnya
        dimana ini dilooping sampai array terakhhir = (cell_size - (index+1))
        contohnya adalah cell_size = 3 maka dilooping menjaid [2][0],[1][1],[0][2]
        lalu jika cell_size =4 maka dilooping menjadi [3][0],[2][1],[1][2],[0][3]
        */
        var arr = []
        for (let index = 0; index < cell_size; index++) {
            var arit1 = cell_size - (index + 1)
            arr.push(horizontal(cell_size)[arit1][index])
        }
        return arr
    }

    // condition when player click a cell
    cellCheck = function (id) {
        var ele = '#' + id
        if ($(ele).hasClass('disable')) {
            alert(lang.already_selected)
        } else if ($(ele).hasClass('unchosen')) {
            if (player_turn == "x") {
                $(ele).removeClass('unchosen')
                $(ele).addClass('disable x')
                $(ele).text("x")
                player_turn = "o"
                player_array("x", id)
                $('#player_turn_info').text(lang.o_turn)
            } else if (player_turn == "o") {
                $(ele).text("o")
                $(ele).addClass('disable o')
                player_turn = "x"
                player_array("o", id)
                $('#player_turn_info').text(lang.x_turn)
            }
        }
    }

    // fill array based on cell that player click
    function player_array(player, cell_id) {
        if (player == "x") {
            x_array.push(cell_id)
        }
        if (player == "o") {
            o_array.push(cell_id)
        }
        checkWin(player)
    }

    //  check win or tie condition based on player
    function checkWin(player) {
        var x_length = x_array.length
        var o_length = o_array.length
        var awc = array_win_combos
        var a_wc = array_win_combos.length
        var temp_score = 0
        // var disable_counter = 0
        for (let index = 0; index < a_wc; index++) {
            awc[index].forEach(function (value) {
                if ($('#' + value).hasClass(player)) {
                    temp_score += 1
                } else {
                    temp_score = 0
                }
                // if ($('#'+value).hasClass('disable')){
                //     disable_counter += 1
                //     console.log('disable: '+disable_counter)
                // }
            })
            if (temp_score == cell_size) {
                if (player == "x") {
                    alert(lang.x_win)
                    location.reload()
                } else {
                    alert(lang.o_win)
                    location.reload()
                }
                break
            } else {
                temp_score = 0
            }
        }
        if (temp_score < cell_size && $('#game_board_table .disable').length == array_master.length) {
            console.log('temp_score: ' + temp_score)
            alert(lang.game_tie)
            location.reload()
        }
    }
});