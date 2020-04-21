module.exports = {
    pages: {
        index: {
            // entry for the page
            entry: 'src/main.ts',
            // the source template
            template: 'public/index.html',
            // output as dist/index.html
            filename: 'index.html',
            // when using title option,
            // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Index Page',
            // chunks to include on this page, by default includes
            // extracted common chunks and vendor chunks.
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },


        help: {
            entry: 'src/help.ts',
            template: 'public/help.html',
            filename: 'help.html',
            title: 'Help Page',
            chunks: ['chunk-vendors', 'chunk-common', 'help']
        },

        thirdparty: {
            entry: 'src/thirdparty.ts',
            template: 'public/thirdparty.html',
            filename: 'thirdparty.html',
            title: 'Third Party Software',
            chunks: ['chunk-vendors', 'chunk-common', 'thirdparty']
        },
    },

    

    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "appId": "a_vue_timer",

                mac: {
                    "category": "public.app-category.productivity",
                    "hardenedRuntime": true,
                    "gatekeeperAssess": false,
                    "entitlements": "./build/entitlements.mac.plist",
                    "entitlementsInherit": "./build/entitlements.mac.inherit.plist",
                     "target": ["dir"],
    
                    "type": "distribution",
                    "provisioningProfile": "./build/embedded.provisionprofile"
                },
            }
        }
    }
}
