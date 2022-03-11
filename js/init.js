var backgroundStyles = [
    'back_01', 'back_02', 'back_03', 'back_04', 'back_05', 'back_06'/*, 'back_07',
    'back_08', 'back_09', 'back_10', 'back_11', 'back_12', 'back_13', 'back_14',
    'back_15', 'back_16', 'back_17', 'back_18', 'back_19', 'back_20', 'back_21'*/,
    'anim_01', 'anim_02', 'anim_03', 'anim_04', 'anim_05', 'anim_06', 'anim_07'
];


chrome.storage.sync.get('background', function(data) {
    var index;

    if (data.background) {
        if ( data.background.nextLoading <= Date.now() ) {
            index = data.background.order[1];
        } else {
            index = data.background.order[0];
        }
    } else {
        index = 1;
    }

    if (index != undefined && backgroundStyles[index].indexOf('anim') == -1) {
        document.body.style.backgroundColor = '#E3D3BE';
    }
});

chrome.storage.sync.get('appsSET1', function(data) {
    var appsHTML = '',
        apps = [{name: 'Weather', url: '/weather', icon: 'icon_weather_logo.png'},
            {name: 'To-Do', url: '/to-do', icon: 'icon_to-do_logo.png'},
            {name: 'Notes', url: '/notes', icon: 'icon_note_logo.png'},
            {name: 'Bookmarks', url: '/bookmarks', icon: 'icon_bookmarks_logo.png'},
            // {name: 'History', url: '/history', icon: 'icon_history_logo.png'}
        ];

    apps.forEach(function(item) {
        appsHTML += '<a class="apps__item"><span class="apps__icon"><img width="64" src="img/'+ item.icon +'" /></span><span class="apps__title"><b>'+ item.name +'</b></span></a>';
    });
    document.getElementById('apps').innerHTML = appsHTML;
});

chrome.storage.sync.get('settings', function(data) {
    if (data.settings != undefined && data.settings.darkTheme) {
        //document.body.classList.add('page_dark');
    }
    if (data.settings != undefined && !data.settings.apps) {
        document.getElementById('apps').style.display = 'none';
        document.querySelector('.search').style.marginBottom = '50px';
    }
});

chrome.runtime.sendMessage({newtabcreated: true});
