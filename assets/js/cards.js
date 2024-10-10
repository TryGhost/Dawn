const setSectionAttributes = () => {
    console.debug('Setting section attributes...')
    const section = document.getElementById('card-container')
    section.setAttribute("class", "card-container")
}


// Modality cards on homepage
//
// Notes:
// Make sure cards.url is a full link!
// Notice those quotations
// Hit me if you have any questions
// 
// e.g.
// const cards = [
//     {
//         title: 'Distros',
//         image: 'https://www.gpb.org/sites/default/files/2024-06/062124_food_distro_01.jpg',
//         url: 'http://theteastand.org/distros/' 
//     },
//     {
//         title: 'Popups',
//         image: 'https://www.gpb.org/sites/default/files/2024-06/062124_food_distro_01.jpg',
//         url: 'https://theteastand.org/popups/' 
//     },
// ]

const cards = [
    {
        title: "⛩️ Popups",
        url: "https://www.theteastand.org/popups/",
        image: "https://i.imgur.com/cjggPYy.jpeg"
    },
    {
        title: "🥬 Distros",
        url: "https://www.theteastand.org/distros/",
        image: "https://i.imgur.com/ozD6q0p.jpeg"
    },
    {
        title: "🫖 Tea Talks",
        url: "https://www.theteastand.org/tea-talks/",
        image: "https://i.imgur.com/oV1PqD6.jpeg"
    },
    {
        title: "📀 Steeped in Sound",
        url: "https://www.theteastand.org/steeped-in-sound/",
        image: "https://i.imgur.com/CywIxsR.jpeg"
    },
]


const createCardElements = () => {
    console.debug('Creating card elements...')
    const section = document.getElementById('card-container')
    cards.map((card) => {
        const cardElement = 
        `
    <a href="${card.url}">
        <div class="cover-card" style="background-image: url(${card.image});">
            <div class="gradient">
                <span class="card-title">
                    ${card.title}
                </span>
            </div>
        </div>
    </a>
    `
        section.innerHTML += cardElement
    })
}

if (cards && cards.length > 0) {
    setSectionAttributes()
    createCardElements()
}