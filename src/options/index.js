$(function () {
    let copyData = null;
    const validationCustom04 = $('#validationCustom02');
    const hours = new Array(24).fill().map((d, i) => i + 1);
    var hour = new Date().getHours();
    const _options = hours.map(d => `<option ${hour === d ? "selected" : ""} value="${d}">${d}点</option>`);
    validationCustom04.html(_options.join(''));

    $('#needs-validation').submit(async function (event) {
        event.stopPropagation()
        event.preventDefault();
        copyData = null;
        if (!event.target.checkValidity()) {
            event.target.classList.add('was-validated');
        } else {
            const screenId = $('#validationCustom01').val();
            const hour = $('#validationCustom02').val();
            let queryOptions = { active: true, currentWindow: true };
            let [tab] = await chrome.tabs.query(queryOptions);
            chrome.tabs.sendMessage(tab.id, {
                eventType: 'import-data-copy',
                key: `${screenId}-${hour}`
            }, {}, function (result) {
                const editor_holder = $('#editor_holder');
                const import_data_copy = $('.import-data-copy');
                editor_holder.css('display', 'none');
                import_data_copy.css('visibility', 'hidden');
                if (result && result.id) {
                    copyData = result;
                    const { layers, ...screen } = result;
                    editor_holder.css('display', 'block');
                    import_data_copy.css('visibility', 'visible');
                    $('#editor_holder .card-body').html(JSON.stringify({
                        ...screen,
                        layers: '...'
                    }));
                    $('.import-data-copy .btn').attr('class', 'btn btn-warning').text('复 制');
                }
            });
            return false;
        }
    });


    $('#import-data-copy-btn').click(copyArea)

    function copyArea() {
        if (!copyData) {
            return false;
        }
        var input = document.createElement("input"); // 直接构建input
        input.value = JSON.stringify({
            ...copyData,
            layers: JSON.parse(copyData.layers)
        }); // 设置内容
        document.body.appendChild(input); // 添加临时实例
        input.select(); // 选择实例内容
        document.execCommand("Copy"); // 执行复制
        if (document.execCommand("Copy")) {
            $('.import-data-copy .btn').removeClass('btn-warning').addClass('btn-success').text('复制成功');
        } else {
            $('.import-data-copy .btn').removeClass('btn-warning').addClass('btn-danger').text('复制失败');
        }
        document.body.removeChild(input); // 删除临时实例
    }

    $('#fetchTest').click(async function () {
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        $('#spinner-color').css('visibility', 'visible');
        chrome.tabs.sendMessage(tab.id, {
            eventType: 'screenExport',
        }, {}, function (result) {
            $('#spinner-color').css('visibility', 'hidden');
            console.log(result);
            // window.__EasyV__Develop__Utils.GetComponents(result);
        })
    })
})
