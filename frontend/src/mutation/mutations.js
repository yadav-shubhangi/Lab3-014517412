
import { gql } from 'apollo-boost'

const createUserMutation = gql`
    mutation AddUser($firstname: String, $lastname: String, $email: String, $password: String, $isOwner: Boolean){
        addUser(firstname: $firstname, lastname: $lastname, email: $email, password: $password, isOwner: $isOwner){
            firstname
            id
        }
    }
`

const addSectionMutation = gql`
    mutation addSection($userId: String, $sectionName: String){
        addSection(userId: $userId, sectionName: $sectionName){
            firstname
            id
        }
    }
`

const addFoodItemMutation = gql`
    mutation addItem($userId: String, $sectionId: String, $itemName: String, $itemDescription: String, $itemPrice: String){
        addItem(userId: $userId, sectionId: $sectionId, itemName: $itemName, itemDescription: $itemDescription, itemPrice: $itemPrice){
            firstname
            id
        }
    }
`

const restaurantInfoMutation = gql`
    mutation restaurantInfo($userId: String, $name: String, $cuisine: String){
        restaurantInfo(userId: $userId, name: $name, cuisine: $cuisine){
            firstname
            id
        }
    }
`
const updateProfileMutation = gql`
    mutation updateProfile($userId: String, $firstname: String, $lastname: String, $email: String, $password: String){
        updateProfile(userId: $userId, firstname: $firstname, lastname: $lastname, email: $email, password: $password){
            firstname
            id
        }
    }
`

export{
    createUserMutation,
    addSectionMutation,
    addFoodItemMutation,
    restaurantInfoMutation,
    updateProfileMutation,
}