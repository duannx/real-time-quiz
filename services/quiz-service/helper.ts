const avatarList = [
    '/avatar-icons/avatar-1.png',
    '/avatar-icons/avatar-2.png',
    '/avatar-icons/avatar-3.png',
    '/avatar-icons/avatar-4.png',
    '/avatar-icons/avatar-5.png',
    '/avatar-icons/avatar-6.png',
    '/avatar-icons/avatar-7.png',
    '/avatar-icons/avatar-8.png',
    '/avatar-icons/avatar-9.png',
]

export function getRandomAvatar() {
    return avatarList[Math.floor(Math.random() * 9)]
}