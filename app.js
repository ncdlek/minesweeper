document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const displayResult = document.querySelector('#result')
    //const displayClickCount = document.querySelector('#count')
    const squares = []
    
    let width = 10
    let bombAmount = 20

    let isGameOver = false

    //create board
    function createBoard() {
        const bombArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width*width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombArray)
        
        //gameArray.sort(() => Math.random() - 0.5) //shuffle array
        for(let i = 0; i < gameArray.length; i++){
            const j = Math.floor(Math.random() * i)
            const temp = gameArray[i]
            gameArray[i] = gameArray[j]
            gameArray[j] = temp
        }

        for(let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(gameArray[i])
            grid.appendChild(square)
            squares.push(square)

            square.addEventListener('click', function(e) {
                click(this)
            })

            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width -1)

            if(squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total++            //left
                if (i > 9 && !isRightEdge && squares[i+1].classList.contains('bomb')) total++           //right
                if (i > 10 && squares[i-width].classList.contains('bomb')) total++                      //up
                if (i < 89 && squares[i+width].classList.contains('bomb')) total++                      //down
                if (i > 11 && !isLeftEdge && squares[i-1-width].classList.contains('bomb')) total++     //up-left
                if (i > 10 && !isRightEdge && squares[i+1-width].classList.contains('bomb')) total++    //up-right
                if (i < 90 && !isLeftEdge && squares[i-1+width].classList.contains('bomb')) total++     //down-left
                if (i < 88 && !isRightEdge && squares[i+1+width].classList.contains('bomb')) total++    //down-right
                
                squares[i].setAttribute('data', total)
            }
        }
    }
    createBoard()

    function addFlag(square) {
        if(isGameOver) return
        if(!square.classList.contains('checked') && !square.classList.contains('flag')) {
            square.classList.add('flag')
            square.innerHTML = '🚩'
            bombAmount--
            displayResult.innerHTML = bombAmount + ' Bombs'
        } else if(square.classList.contains('flag')) {
            square.classList.remove('flag')
            square.innerHTML = ''
            bombAmount++
            displayResult.innerHTML = bombAmount + ' Bombs'
        }
    }

    function click(square) {
        //let currentId = square.id
        if(isGameOver) return
        if(square.classList.contains('checked') || square.classList.contains('flag')) return
        if(square.classList.contains('bomb')) {
            gameOver()
        } else {
            let total = square.getAttribute('data')
            if(total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                checkForWin()
                return
            }
            checkSquare(square)//, currentId)
        }
        square.classList.add('checked')
        checkForWin()
    }

    //check neighboring squares one square is clicked
    function checkSquare(square) {
        const isLeftEdge = (square.id % width === 0)
        const isRightEdge = (square.id % width === width -1)

        setTimeout(() => {
            if(square.id > 0 && !isLeftEdge) click(document.getElementById(squares[parseInt(square.id) - 1].id))            //left
            if(square.id > 9 && !isRightEdge) click(document.getElementById(squares[parseInt(square.id) + 1].id))           //right
            if(square.id > 10) click(document.getElementById(squares[parseInt(square.id) - width].id))                      //up
            if(square.id < 89) click(document.getElementById(squares[parseInt(square.id) + width].id))                      //down
            if(square.id > 11 && !isLeftEdge) click(document.getElementById(squares[parseInt(square.id) - 1 - width].id))   //up-left
            if(square.id > 10 && !isRightEdge) click(document.getElementById(squares[parseInt(square.id) + 1- width].id))   //up-right
            if(square.id < 90 && !isLeftEdge) click(document.getElementById(squares[parseInt(square.id) - 1 + width].id))   //down-left
            if(square.id < 88 && !isRightEdge) click(document.getElementById(squares[parseInt(square.id) + 1 + width].id))  //down-right
        },10)
    }

    function gameOver() {
        displayResult.innerHTML = 'BOOM! Game Over!'
        isGameOver = true

        squares.forEach(square => {
            if(square.classList.contains('bomb')) square.innerHTML = '💣'
        })
    }

    function checkForWin() {
        var total = 0
        squares.forEach(square => {
            if(square.classList.contains('checked')) total++
        })

        if(total + bombAmount === width * width) displayResult.innerHTML = 'YOU WON!'
    }
})