/* eslint-disable no-console */
import {reactive} from 'vue'

export default function useUpdater() {

    let updateData = reactive({
        // refresh variables
        refreshing: false,
        registration: null,
        updateExists: false,
        snackUpdateExists: false,
    })

    function created() {
        // Listen for our custom event from the SW registration
        document.addEventListener('swUpdated', this.updateAvailable, { once: true })
    
        if (process.env.NODE_ENV === 'production') {
          // Prevent multiple refreshes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (updateData.refreshing) return
            updateData.refreshing = true
            // Here the actual reload of the page occurs
            window.location.reload()
          })
        }
    }

    function updateAvailable(event) {
        //updateData.value.registration = event.detail
        updateData.registration = event.detail
        updateData.updateExists = true
        updateData.snackUpdateExists = true
        //updateData.value.updateExists = true
        console.log("updateAvailable " + updateData.updateExists)
    }
  
      // Called when the user accepts the update
    function refreshApp() {
        updateData.updateExists = false
        updateData.snackUpdateExists = false
        //updateData.value.updateExists = false
        // Make sure we only send a 'skip waiting' message if the SW is waiting
        if (!updateData.registration || !updateData.registration.waiting) return
        // send message to SW to skip the waiting and activate the new SW
        updateData.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }

    return {
        updateData,
        created,
        updateAvailable,
        refreshApp
    };
    /*data() {
      return {
        // refresh variables
        refreshing: false,
        registration: null,
        updateExists: false,
      }
    },
  
    created() {
      // Listen for our custom event from the SW registration
      document.addEventListener('swUpdated', this.updateAvailable, { once: true })
  
      // Prevent multiple refreshes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (this.refreshing) return
        this.refreshing = true
        // Here the actual reload of the page occurs
        window.location.reload()
      })
    },
  
    methods: {
      // Store the SW registration so we can send it a message
      // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
      // To alert the user there is an update they need to refresh for
      updateAvailable(event) {
        this.registration = event.detail
        this.updateExists = true
      },
  
      // Called when the user accepts the update
      refreshApp() {
        this.updateExists = false
        // Make sure we only send a 'skip waiting' message if the SW is waiting
        if (!this.registration || !this.registration.waiting) return
        // send message to SW to skip the waiting and activate the new SW
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      },
    },*/
  }

  