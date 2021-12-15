import css from "./style.scss";
import axios from "axios" ;
// 抓取 API 資料，渲染畫面
const url = "https://hexschool.github.io/js-filter-data/data.json";
const showList = document.getElementById('showList');
let data = [];

function getData () {
    axios.get(url).then(function (response) {
        data = response.data.filter(item => {
            if (item.作物名稱 !== null && item.作物名稱 !== '' ) {
                return item;
            }
        });
        renderData(data);
    });
}
getData();

function renderData (showData) {
    let str = '';
    showData.forEach((item) => {
        str += `<tr>
        <td>${item.作物名稱}</td>
        <td>${item.市場名稱}</td>
        <td>${item.上價}</td>
        <td>${item.中價}</td>
        <td>${item.下價}</td>
        <td>${item.平均價}</td>
        <td>${item.交易量}</td>
        </tr>`
        
    });
    showList.innerHTML = str;
}

// 種類篩選，在 button 裡有埋 data-type
// 監聽三個按鈕的大區塊
const buttonGroup = document.querySelector(".button-group");
// 宣告這三個按鈕的節點，tabs 為類陣列
let tabs = document.querySelectorAll('.button-group button');
buttonGroup.addEventListener('click',function (e) {
    // 透過 if 判斷式判斷是否點到按鈕
    if (e.target.nodeName === 'BUTTON') {
        // 利用回圈拿掉按鈕的 active 樣式
        tabs.forEach((item) => {
            item.classList.remove('active');
        });
        // 取出埋在 html 裡的 data-type 的值賦予到變數 type 上
        let type = e.target.dataset.type;
        // 用 if 判斷式去判斷是 N04、N05、N06 哪一個，並在裡面用 filter 篩選資料再渲染出來
        // let filterData = [];
        if (type === 'N04') {
            changeType(type);
            e.target.classList.add('active');
        } else if (type === 'N05') {
            changeType(type);
            e.target.classList.add('active');
        } else if (type === 'N06') {
            changeType(type);
            e.target.classList.add('active');
        };
        // renderData(filterData);
    };
});

// 將判斷 type 裏面 filter 重複的地方，重新包裝成一個函式
function changeType (type) {
    let filterData = [];
    filterData = data.filter((item) => {
        if (item.種類代碼 === type) {
            return item;
        }
    });
    renderData(filterData);
};

// 搜尋資料
const searchGroup = document.querySelector('.search-group');
const cropName = document.getElementById('js-crop-name');
const inputSearch = document.getElementById('crop');
searchGroup.addEventListener('click', function (e) { 
    // 透過 if 判斷是否點擊到按鈕
    if (e.target.nodeName === 'BUTTON') {
        // 用 trim 濾掉空白字串，若為空白就中斷函式
        if (inputSearch.value.trim() === '') {
            alert('請輸入想要知道的作物唷！')
            return;
        }
        let filterData = [];
        // 利用 filter 跟 match 來篩選資料
        filterData = data.filter((item) => {
            // 搜尋後清除 active 狀態
            tabs.forEach((item) => {
                item.classList.remove('active');
            });
            cropName.textContent = `查看『 ${inputSearch.value} 』的比價結果`
            // 因為作物名稱裡面有 null 型別，所以只有寫 item.作物名稱.match (inputSearch.value)的話會出現錯誤
            return (item.作物名稱 && item.作物名稱.match(inputSearch.value.trim()));
        });
        // 若找不到資料（也就是篩選後資料長度為 0 ，就顯示找不到
        if (filterData.length == 0) {
            showList.innerHTML = `<tr><td colspan="6" class="text-center p-3">查詢不到交易資訊QQ</td></tr>`;
        } else {
            renderData(filterData);
        }
    };
});

// 下拉式選單 排序資料
const select = document.querySelector('.sort-select');
// 監聽 select 的 change 事件
select.addEventListener('change', selectFunction);
function selectFunction (e) {
    // 使用 switch 來判斷
    switch (e.target.value) {
      case "依上價排序":
        selectChange('上價')
        break;
      case "依中價排序":
        selectChange('中價')
        break;
      case "依下價排序":
        selectChange('下價')
        break;
      case "依平均價排序":
        selectChange('平均價')
        break;
      case "依交易量排序":
        selectChange('交易量')
        break;
    };
    function selectChange (value) {
        data.sort(function (a,b) {
            return a[value] - b[value];
        });
        renderData(data);
    }
};

// 透過上下箭頭切換去排序資料

const sortAdvanced = document.querySelector('.js-sort-advanced');
sortAdvanced.addEventListener('click', function (e) {
    if (e.target.nodeName === 'I') {
        const sortPrice = e.target.dataset.price;
        const sortCaret = e.target.dataset.sort;
        if (sortCaret === 'up') {
            data.sort(function (a,b) {
                return b[sortPrice] - a[sortPrice];
                // b - a 可實現從大排到小
            });
        } else {
            data.sort(function (a,b) {
                return a[sortPrice] - b[sortPrice];
                // a -  b 可實現從小排到大
            });
        }
        renderData(data);
    }
})
