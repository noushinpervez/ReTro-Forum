// initialize count and array to keep track of read posts
let count = 0;
let readPosts = [];

// to store the last searched category
let lastSearchedCategory = '';

const postContainer = document.getElementById('post-container');

// function to load posts based on the provided link
const loadPosts = async (link) => {
    const res = await fetch(link);
    const postData = await res.json();

    // check if the data contains 'posts' property to distinguish between all posts and latest posts
    if (postData.posts) {
        // if 'posts' property exists, display all posts
        displayAllPosts(postData.posts);
    }
    else {
        // if 'posts' property doesn't exist, display latest posts
        displayLatestPosts(postData);
    }
};

// function to display all posts in the specified post container
const displayAllPosts = posts => {
    // clear existing post cards from the container
    postContainer.textContent = '';

    // display a message for no matching results
    if (posts.length === 0) {
        postContainer.innerHTML = `
        <div>
            <p class="text-[#f1644f] text-base lg:text-xl font-semibold leading-7">No Post Found</p>
        </div>
        `;
    }
    else {
        // show data loading indicator
        dataLoadingIndicator(true);

        // iterating through each post and creating a card element for each post
        posts.forEach(post => {
            const postCard = createPostCard(post);
            postContainer.appendChild(postCard);
        });

        // hide the loading indicator after 2 seconds
        setTimeout(() => {
            dataLoadingIndicator(false);
        }, 2000);
    }
};

// function to create a post card element
const createPostCard = (post) => {
    const postCard = document.createElement('div');
    postCard.classList = `card card-side bg-postBg inter hover:bg-postHover/10 hover:border hover:border-postBorder ease-in duration-300 p-[5%]`;

    // post card inner HTML content based on post data
    postCard.innerHTML = `
        <div class="avatar max-w-[9%] h-fit relative">

            <!-- user image -->
            <div class="rounded-2xl">
                <img src="${post?.image}" />
            </div>

            <!-- active/inactive badge -->
            <div class="badge badge-xs lg:badge-sm absolute right-0 -top-1 lg:border-2 lg:border-white ${post?.isActive ? 'bg-[#10B981]' : 'bg-[#FF3434]'}"></div>
        </div>

        <div class="card-body py-0 pr-0 pl-[3%]">

            <!-- category and author info -->
            <div class="flex gap-5 w-fit">
                <p class="text-secondaryColor/80 text-xs lg:text-sm font-medium">#${post?.category}</p>
                <p class="text-secondaryColor/80 text-xs lg:text-sm font-medium">Author: ${post?.author?.name}</p>
            </div>

            <!-- post title -->
            <div>
                <h2 class="card-title mulish text-primaryColor text-base lg:text-xl font-bold lg:mt-3" id="${post.id}">${post?.title}</h2>
            </div>

            <!-- post description -->
            <div>
                <p class="text-secondaryColor/60 text-xs lg:text-base leading-7 lg:mt-4">${post?.description}</p>
            </div>

            <!-- horizontal line -->
            <div class="border border-dashed border-secondaryColor/25 lg:mt-5"></div>

            <div class="flex justify-between lg:mt-6">

                <!-- post metrics -->
                <div class="flex gap-2 lg:gap-6">
                    <!-- comment count -->
                    <div class="flex lg:gap-3 items-center">
                        <div role="button">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.33333 10.5H18.6667M9.33333 15.1667H16.3333M10.5 21H7C6.07174 21 5.1815 20.6312 4.52513 19.9749C3.86875 19.3185 3.5 18.4282 3.5 17.5V8.16666C3.5 7.2384 3.86875 6.34816 4.52513 5.69178C5.1815 5.03541 6.07174 4.66666 7 4.66666H21C21.9283 4.66666 22.8185 5.03541 23.4749 5.69178C24.1313 6.34816 24.5 7.2384 24.5 8.16666V17.5C24.5 18.4282 24.1313 19.3185 23.4749 19.9749C22.8185 20.6312 21.9283 21 21 21H17.5L14 24.5L10.5 21Z" stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <p class="text-secondaryColor/60 text-xs lg:text-base">${post?.comment_count}</p>
                    </div>

                    <!-- view count -->
                    <div class="flex lg:gap-3 items-center">
                        <div role="button">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.6667 14C11.6667 14.6188 11.9125 15.2123 12.3501 15.6499C12.7877 16.0875 13.3812 16.3333 14 16.3333C14.6188 16.3333 15.2123 16.0875 15.6499 15.6499C16.0875 15.2123 16.3333 14.6188 16.3333 14C16.3333 13.3812 16.0875 12.7877 15.6499 12.3501C15.2123 11.9125 14.6188 11.6667 14 11.6667C13.3812 11.6667 12.7877 11.9125 12.3501 12.3501C11.9125 12.7877 11.6667 13.3812 11.6667 14Z" stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M24.5 14C21.7 18.6667 18.2 21 14 21C9.8 21 6.3 18.6667 3.5 14C6.3 9.33333 9.8 7 14 7C18.2 7 21.7 9.33333 24.5 14Z" stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <p class="text-secondaryColor/60 text-xs lg:text-base" id="${post.id}${post.view_count}">${post?.view_count}</p>
                    </div>

                    <!-- posted time -->
                    <div class="flex lg:gap-3 items-center">
                        <div role="button">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.91667 14H14V8.16667M3.5 14C3.5 15.3789 3.77159 16.7443 4.29926 18.0182C4.82694 19.2921 5.60036 20.4496 6.57538 21.4246C7.55039 22.3996 8.70791 23.1731 9.98182 23.7007C11.2557 24.2284 12.6211 24.5 14 24.5C15.3789 24.5 16.7443 24.2284 18.0182 23.7007C19.2921 23.1731 20.4496 22.3996 21.4246 21.4246C22.3996 20.4496 23.1731 19.2921 23.7007 18.0182C24.2284 16.7443 24.5 15.3789 24.5 14C24.5 12.6211 24.2284 11.2557 23.7007 9.98182C23.1731 8.70791 22.3996 7.55039 21.4246 6.57538C20.4496 5.60036 19.2921 4.82694 18.0182 4.29927C16.7443 3.77159 15.3789 3.5 14 3.5C12.6211 3.5 11.2557 3.77159 9.98182 4.29927C8.70791 4.82694 7.55039 5.60036 6.57538 6.57538C5.60036 7.55039 4.82694 8.70791 4.29926 9.98182C3.77159 11.2557 3.5 12.6211 3.5 14Z" stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <p class="text-secondaryColor/60 text-xs lg:text-base">${post?.posted_time}</p>
                    </div>
                </div>

                <!-- mark as read button -->
                <div role="button" onclick="markAsRead(${post.id}, ${post.id}${post.view_count})">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_57_573)">
                            <path d="M13.9998 0C6.26805 0 9.15527e-05 6.26814 9.15527e-05 13.9999C9.15527e-05 21.7314 6.26805 28 13.9998 28C21.7315 28 27.9999 21.7314 27.9999 13.9999C27.9999 6.26814 21.7315 0 13.9998 0ZM14 4.91741L22.2847 10.0835H5.71542L14 4.91741ZM22.3879 18.333H22.3871C22.3871 19.1616 21.7155 19.8331 20.887 19.8331H7.1131C6.28447 19.8331 5.61303 19.1615 5.61303 18.333V10.4122C5.61303 10.3245 5.62199 10.2393 5.63655 10.1556L13.552 15.0914C13.5617 15.0975 13.5721 15.1016 13.5821 15.1072C13.5925 15.113 13.6032 15.1186 13.6138 15.1239C13.6697 15.1527 13.7273 15.176 13.7862 15.1912C13.7923 15.1929 13.7983 15.1936 13.8044 15.195C13.869 15.2102 13.9344 15.2197 13.9998 15.2197H14.0002C14.0007 15.2197 14.0012 15.2197 14.0012 15.2197C14.0665 15.2197 14.1319 15.2105 14.1965 15.195C14.2026 15.1935 14.2086 15.1929 14.2147 15.1912C14.2735 15.176 14.3309 15.1527 14.3871 15.1239C14.3977 15.1186 14.4084 15.113 14.4188 15.1072C14.4287 15.1016 14.4392 15.0975 14.4489 15.0914L22.3644 10.1556C22.3789 10.2393 22.3879 10.3244 22.3879 10.4122V18.333Z" fill="#10B981"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_57_573">
                                <rect width="28" height="28" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>
        `;

    return postCard;
};

// function to display latest posts in the specified post container
const displayLatestPosts = posts => {
    const latestPostContainer = document.getElementById('latest-post-container');

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList = `card bg-white border border-secondaryColor/15 p-[2%] h-fit hover:bg-postHover/10 hover:border hover:border-postBorder ease-in duration-300`;

        postCard.innerHTML = `
        <!-- cover image -->
        <img src="${post?.cover_image}" alt="" class="rounded-[20px]" />

        <!-- posted date -->
        <div class="flex items-center gap-2 mt-3 lg:mt-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_29_1881)">
                    <path
                        d="M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V7Z"
                        stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16 3V7" stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8 3V7" stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4 11H20" stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                        d="M11 16C11 16.2652 11.1054 16.5196 11.2929 16.7071C11.4804 16.8946 11.7348 17 12 17C12.2652 17 12.5196 16.8946 12.7071 16.7071C12.8946 16.5196 13 16.2652 13 16C13 15.7348 12.8946 15.4804 12.7071 15.2929C12.5196 15.1054 12.2652 15 12 15C11.7348 15 11.4804 15.1054 11.2929 15.2929C11.1054 15.4804 11 15.7348 11 16Z"
                        stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_29_1881">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            <p class="text-secondaryColor/60 text-xs lg:text-base">${post?.author?.posted_date || 'No Publish Date'}</p>
        </div>

        <!-- post title and description -->
        <h2 class="card-title text-primaryColor text-sm lg:text-lg font-extrabold leading-7 mt-2 lg:mt-4">${post.title}</h2>
        <p class="text-secondaryColor/60 text-xs lg:text-base leading-7 lg:mt-3 lg:line-clamp-2">${post?.description}</p>


        <div class="flex items-center gap-2 lg:gap-4 mt-2 lg:mt-4">

            <!-- user image -->
            <div class="avatar w-[12%] h-[9%]">
                <div class="rounded-full">
                    <img src="${post?.profile_image}" />
                </div>
            </div>

            <!-- author info -->
            <div class="flex flex-col">
                <p class="text-primaryColor text-xs lg:text-base font-bold">${post?.author?.name}</p>
                <p class="text-secondaryColor/60 text-xs lg:text-sm">${post?.author?.designation || 'Unknown'}</p>
            </div>
        </div>
        `;

        latestPostContainer.appendChild(postCard);
    });
};

// function to increment the read count and update the count
const readCount = () => {
    count += 1;
    document.getElementById('read-count').innerText = count;
};

// function to display read posts in a separate container
const displayReadPosts = (titleId, viewCountId) => {
    const title = document.getElementById(titleId).innerText;
    const viewCount = document.getElementById(viewCountId).innerText;

    const markReadContainer = document.getElementById('mark-as-read');

    const postCard = document.createElement('div');
    postCard.classList = `flex flex-col lg:gap-4`;

    postCard.innerHTML = `
    <div class="flex justify-between bg-white rounded-2xl p-[4%] mt-2 lg:mt-4">
        
        <!-- post title -->
        <p class="text-primaryColor text-xs lg:text-base font-semibold leading-7">${title}</p>

        <!-- view count -->
        <div class="flex gap-2 items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11.6667 14C11.6667 14.6188 11.9125 15.2123 12.3501 15.6499C12.7877 16.0875 13.3812 16.3333 14 16.3333C14.6188 16.3333 15.2123 16.0875 15.6499 15.6499C16.0875 15.2123 16.3333 14.6188 16.3333 14C16.3333 13.3812 16.0875 12.7877 15.6499 12.3501C15.2123 11.9125 14.6188 11.6667 14 11.6667C13.3812 11.6667 12.7877 11.9125 12.3501 12.3501C11.9125 12.7877 11.6667 13.3812 11.6667 14Z"
                    stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M24.5 14C21.7 18.6667 18.2 21 14 21C9.8 21 6.3 18.6667 3.5 14C6.3 9.33333 9.8 7 14 7C18.2 7 21.7 9.33333 24.5 14Z"
                    stroke="#12132D" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="text-secondaryColor/60 text-xs lg:text-base">${viewCount}</p>
        </div>
    </div>
    `;

    markReadContainer.appendChild(postCard);
};

// function to mark a post as read and update design
const markAsRead = (titleId, viewCountId) => {
    // check if the post is not already marked as read
    if (!readPosts.includes(titleId)) {
        readPosts.push(titleId);
        readCount();
        displayReadPosts(titleId, viewCountId);
    }
};

// function to handle search categories
const handleSearch = () => {
    const searchField = document.getElementById('search-field');
    const searchText = searchField.value.trim();

    // hide stats for small devices
    const statContainer = document.getElementById('stat');
    statContainer.classList.add('hidden')

    if (searchText !== lastSearchedCategory) {
        // load posts based on the search category and show all posts
        const categoryUrl = `https://openapi.programming-hero.com/api/retro-forum/posts?category=${searchText}`;
        loadPosts(categoryUrl);

        // update the last searched category
        lastSearchedCategory = searchText;
    }
};

// function to handle data loading indicator visibility
const dataLoadingIndicator = (isLoading) => {
    const loadingIndicator = document.getElementById('data-loading');
    const statContainer = document.getElementById('stat');

    // show or hide the loading indicator based on the isLoading parameter
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
        // hide posts container
        postContainer.classList.add('hidden');
    }
    else {
        loadingIndicator.classList.add('hidden');
        // show posts container
        postContainer.classList.remove('hidden');
    }
};

// fetch all posts
loadPosts(`https://openapi.programming-hero.com/api/retro-forum/posts`);

// fetch latest posts
loadPosts(`https://openapi.programming-hero.com/api/retro-forum/latest-posts`);