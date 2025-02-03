import axios from 'axios'

const BASE_URL = 'http://localhost:5005'

export async function getStore (token) {
  try {
    const response = await axios.get(`${BASE_URL}/store`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.store
  } catch (err) {
    alert(`Error getting store: ${err.message}`)
  }
}

/**
 * Get presentation content from ID
 * @param {*} token
 * @returns
 */
export async function getPresentation (token, presentationId) {
  try {
    const store = await getStore(token)
    const found = store.presentations.find(
      p => String(p.id) === String(presentationId)
    )
    return found
  } catch (err) {
    alert(`Error getting presentation: ${err.message}`)
  }
}

/**
 * Update the name of a presentation
 * @param {string} token Authentication token
 * @param {string} presentationId ID of the presentation to update
 * @param {string} newName New name for the presentation
 */
export async function updatePresentation (token, presentationId, newName) {
  try {
    // Fetch the current store
    const store = await getStore(token)
    // Find the index of the presentation to update
    const presentationIndex = store.presentations.findIndex(
      p => String(p.id) === String(presentationId)
    )
    if (presentationIndex === -1) {
      throw new Error('Presentation not found')
    }
    // Update the presentation's name
    store.presentations[presentationIndex].name = newName
    // Save the updated store
    await putStore(token, store)
  } catch (err) {
    alert(`Error updating presentation: ${err.message}`)
    throw err // Re-throw to allow further handling
  }
}

/**
 * Delete presentation from ID
 * @param {*} token
 * @param {*} presentationId
 * @param {*} navigate
 */
export const deletePresentation = async (
  token,
  presentationId
) => {
  try {
    const store = await getStore(token)
    const newStore = store.presentations.filter(
      p => String(p.id) !== String(presentationId)
    )
    const payload = { store: { presentations: newStore } }
    await putStore(token, payload)
  } catch (err) {
    alert(`Error deleting presentation: ${err.message}`)
  }
}

export async function putStore (token, payload) {
  try {
    await axios.put(`${BASE_URL}/store`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (err) {
    alert(`Error putting store: ${err.message}`)
  }
}
