'use strict'

// routes

const rm = routeMapper

rm
.resources('photos')
.resources('comments')
.get('users', { controller: 'users', action: 'index' })
