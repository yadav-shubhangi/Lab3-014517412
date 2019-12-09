import { gql } from 'apollo-boost'

const loginUserQuery = gql`
{
    allUsers {
        id
        email
        password
        userType
        name
    }
}
`
const getSectionQuery = gql`
{
    allUsers {
        id
        restaurantInfo{
        sections{
            id
            name
          }
        }
    }
}
`
const getFoodItemQuery = gql`
{
    allUsers {
        id
        restaurantInfo{
            name
            cuisine
            sections{
                id
                name
                items {
                    id
                    name
                    description
                    price
                }
            }
        }
    }
}
`
const getRestaurants = gql`
{
    allUsers {
        id
      	isOwner
        restaurantInfo{
          name
          cuisine
        }
    }
}
`
const getProfile = gql`
{
    allUsers {
        id
        email
        name
        password
      	userType
    }
}
`
export {
    loginUserQuery,
    getSectionQuery,
    getFoodItemQuery,
    getRestaurants,
    getProfile,
}