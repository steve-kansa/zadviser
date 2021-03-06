module.exports = {
    themeConfig: {
        nav: [{
                text: 'Home',
                link: '/'
            },
            {
                text: 'Learn',
                link: '/learn.md'
            },
            {
                text: 'Getting Started',
                items: [{
                        text: 'Enable zAdviser',
                        link: '/guide/link1.md'
                    },
                    {
                        text: 'Use zAdviser',
                        link: '/guide/link2.md'
                    }
                ]
            },
            {
                text: 'Status',
                link: 'https://zadviser.statuspage.io'
            }
        ],
            // Assumes GitHub. Can also be a full GitLab url.
            repo: 'david-kennedy/zadviser',
            // Customising the header label
            // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
            repoLabel: 'Contribute',
        
            // Optional options for generating "Edit this page" link
        
            // if your docs are in a different repo from your main project:
            //docsRepo: 'vuejs/vuepress',
            // if your docs are not at the root of the repo:
            //docsDir: 'docs',
            // if your docs are in a specific branch (defaults to 'master'):
            //docsBranch: 'master',
            // defaults to false, set to true to enable
            editLinks: true,
            // custom text for edit link. Defaults to "Edit this page"
            editLinkText: 'Edit on Github',
            displayAllHeaders: true, // Default: false,
            lastUpdated: 'Last Updated'

    },
    
}

// module.exports = {
//     themeConfig: {
//       displayAllHeaders: true // Default: false
//     }
//   }