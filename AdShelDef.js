/**
 * AdShield Defender - Advanced Ad Blocker Detection
 * @author HAIMING
 * @github https://github.com/ihaiming/AdShieldDefender
 * @license GPL-3.0
 */
(function(){
    // 检测广告拦截器
    function ADSD_detectAdBlock() {
        return new Promise((resolve) => {
            let detected = false;
            let tests = 0;
            let passed = 0;
            
            // 方法1: 检查广告脚本
            tests++;
            let adScript = document.createElement('script');
            adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            adScript.onerror = function() {
                passed++;
                if(passed >= 2) {
                    detected = true;
                    resolve(true);
                }
            };
            adScript.onload = function() {
                tests--;
                if(tests - passed < 2 && !detected) {
                    resolve(false);
                }
            };
            document.head.appendChild(adScript);
            
            // 方法2: 检查广告元素
            tests++;
            let adElement = document.createElement('div');
            adElement.innerHTML = '&nbsp;';
            adElement.className = 'adsbox';
            adElement.style.cssText = 'width: 1px; height: 1px; position: absolute; left: -100px; top: -100px;';
            document.body.appendChild(adElement);
            setTimeout(() => {
                let isHidden = adElement.offsetHeight === 0;
                document.body.removeChild(adElement);
                if(isHidden) {
                    passed++;
                }
                if(passed >= 2 && !detected) {
                    detected = true;
                    resolve(true);
                }
                tests--;
                if(tests - passed < 2 && !detected) {
                    resolve(false);
                }
            }, 100);
            
            // 方法3: 检查广告资源
            tests++;
            let adImage = new Image();
            adImage.onerror = function() {
                passed++;
                if(passed >= 2 && !detected) {
                    detected = true;
                    resolve(true);
                }
            };
            adImage.onload = function() {
                tests--;
                if(tests - passed < 2 && !detected) {
                    resolve(false);
                }
            };
            adImage.src = 'https://ad.doubleclick.net/favicon.ico?rand=' + Math.random();
            
            // 方法4: 检查XMLHttpRequest
            tests++;
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', true);
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    if(xhr.status === 0) {
                        passed++;
                        if(passed >= 2 && !detected) {
                            detected = true;
                            resolve(true);
                        }
                    }
                    tests--;
                    if(tests - passed < 2 && !detected) {
                        resolve(false);
                    }
                }
            };
            xhr.send();
            
            // 超时处理
            setTimeout(() => {
                if(!detected) {
                    resolve(passed >= 2);
                }
            }, 2000);
        });
    }
    
    // 显示广告拦截提示
    function ADSD_showAlert() {
        let alert = document.getElementById('adsd-alert');
        if(alert) {
            alert.style.display = 'flex';
            // 设置cookie，24小时内不再显示
            let date = new Date();
            date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
            document.cookie = "adsd_alert_shown=true; expires=" + date.toUTCString() + "; path=/";
        }
    }
    
    // 检查是否已经显示过提示
    function ADSD_shouldShowAlert() {
        let cookies = document.cookie.split(';');
        for(let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if(cookie.startsWith('adsd_alert_shown=')) {
                return false;
            }
        }
        return true;
    }
    
    // 关闭主提示
    function ADSD_closeAlert() {
        let alert = document.getElementById('adsd-alert');
        if(alert) {
            alert.style.display = 'none';
        }
    }
    
    // 显示帮助弹窗
    function ADSD_showHelp() {
        let helpModal = document.getElementById('adsd-help-modal');
        if(helpModal) {
            helpModal.style.display = 'flex';
        }
    }
    
    // 关闭帮助弹窗
    function ADSD_closeHelp() {
        let helpModal = document.getElementById('adsd-help-modal');
        if(helpModal) {
            helpModal.style.display = 'none';
        }
    }
    
    // 清除cookie（测试用）
    function ADSD_clearCookie() {
        document.cookie = "adsd_alert_shown=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log('AdShield Defender cookie cleared. Refresh page to test detection.');
    }
    
    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        // 检测广告拦截器
        if(ADSD_shouldShowAlert()) {
            setTimeout(() => {
                ADSD_detectAdBlock().then((detected) => {
                    if(detected) {
                        ADSD_showAlert();
                    }
                });
            }, 1500);
        }
        
        // 绑定按钮事件
        let dismissBtn = document.getElementById('adsd-dismiss-btn');
        let learnMoreBtn = document.getElementById('adsd-learn-more-btn');
        let helpConfirmBtn = document.getElementById('adsd-help-confirm-btn');
        
        if(dismissBtn) {
            dismissBtn.addEventListener('click', ADSD_closeAlert);
        }
        
        if(learnMoreBtn) {
            learnMoreBtn.addEventListener('click', ADSD_showHelp);
        }
        
        if(helpConfirmBtn) {
            helpConfirmBtn.addEventListener('click', ADSD_closeHelp);
        }
        
        // 测试功能：在控制台运行 ADSD_clearCookie() 清除cookie重新测试
        window.ADSD_clearCookie = ADSD_clearCookie;
        console.log('AdShield Defender loaded. Run ADSD_clearCookie() in console to reset detection.');
    });
})();