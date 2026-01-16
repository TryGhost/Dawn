var fakeData = function fakeData(themeFile) {
    var tag = {
        id: '345678901',
        name: 'hill',
        description: 'tag for hill',
        feature_image: '/content/2017/07/tag-image.jpg',
        meta_title: 'meta title for hill tag',
        meta_description: 'meta description for hill tag',
        url: 'http://talltalesofhighhills.com/tag/hill'
    };

    var author = {
        id: '234567890',
        name: 'John McHill',
        slug: 'john-mchill',
        bio: 'I "Troll" through hills',
        location: 'On top of a hill',
        website: 'http://hills.com',
        twitter: '/hill',
        facebook: '/hill',
        profile_image: '/content/2017/07/johnmchill.jpg',
        cover_image: '/content/2017/07/johnmchillontopofahighhill.jpg',
        url: 'http:///talltalesofhighhills.com/author/john-mchill'
    };

    var post = {
        id: '123456789',
        title: 'The highs and lows of hills',
        slug: 'the-highs-and-low-of-hills',
        excerpt: 'Hills can be hilly',
        content: 'Hills can be hilly when they are like hills',
        url: 'http://talltalesofhighhills.com/the-highs-and-low-of-hills',
        feature_image: '/content/2017/07/highhill.jpg',
        featured: 0,
        page: 0,
        meta_title: 'The hill felt hilly  - how meta is that?',
        meta_description: 'a meta description about a meta description hmm...',
        published_at: '2017-07-01T12:00:00.000Z' ,
        update_at: '2017-07-01T12:00:00.000Z',
        created_at: '2017-07-01T12:00:00.000Z',
        author: author,
        tags: [{tag: tag}]
    };

    // Initialise data for index/home hbs templates
    var postsData = {posts: [post], pagination: {}};

    if (themeFile.file.match(/^post/) || themeFile.file.match(/^page/)) {
        postsData = {post: post};
    } else if (themeFile.file.match(/^tag/)) {
        postsData = {tag: tag, pagination: {}};
    } else if (themeFile.file.match(/^author/)) {
        postsData = {author: author, pagination: {}};
    }

    return postsData;
};

module.exports = fakeData;
