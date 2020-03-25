(function (win) {

    var backDomain = `http://localhost:8200`; //后台部署的服务器ip

    win.ENV = {
        backend: backDomain,
    };
})(window);
