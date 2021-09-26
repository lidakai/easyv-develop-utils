function GetpanelComponentLoop(panel, lists) {
    // 获取动态面板组件数据 loop
    if (panel && panel.length) {
        return panel.map(d => d.stateConfig.map(d1 => {
            const list = d1.componentsConfig && d1.componentsConfig.length ? d1.componentsConfig : [];
            const _list = lists.concat(...list)
            if (d1.panelConfig && d1.panelConfig.length) {
                return GetpanelComponentLoop(d1.panelConfig, _list);
            }
            return _list
        }))
    }
}

function GetComponents(result) {
    const data = result.data;
    const list = data.componentsConfig && data.componentsConfig.length ? data.componentsConfig : [];
    if (data.panelConfig && data.panelConfig.length) {
        const components = GetpanelComponentLoop(data.panelConfig, list).flat(Infinity);
        const uniqueTags = new Set();
        components.map(d => uniqueTags.add(d.id));
        const filterOnly = components.filter(d => Array.from(uniqueTags).includes(d.id));
        console.log(components, Array.from(uniqueTags));
    };
}


window.__EasyV__Develop__Utils = {
    GetComponents
}