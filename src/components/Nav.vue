<script setup>
import { firebaseAuth } from '../../firebase/config';
import { useStore } from "vuex";
import { ref,watchEffect, computed } from "vue";
// import Breadcrumb from "primevue/breadcrumb";

const store = useStore()
const userState = computed(() => store.state.auth.userDetails)

const firebaseUser = () => firebaseAuth.onAuthStateChanged(user => {
  // console.warn(`firebaseAuth.onAuthStateChanged ${JSON.stringify(user)}`)
  if (user) {
    store.commit('successRequestUser', user)
  } else {
    store.commit('failRequestUser', 'Fail to get user')
  }
});
watchEffect(firebaseUser)
let site= computed(()=>{
  if (document.location.href.toLowerCase().search("fitness.forthe.life")!=-1) 
    return "Fitness.ForThe.life"
  if (document.location.href.toLowerCase().search("memories.forthe.life")!=-1) 
    return "Memories.ForThe.life"
  // default
  return 'RUN PiX'
  })

// bread crumbs  WIP
// const items=ref([{
//   '/':{label:'Home'},
//   'e':{label:'Events'},
//   'p':{label:'Photos'}
// }
// ])

// const home = ref({ icon: 'pi pi-home', url: 'https://primevue.org/' });
// const items = ref([{ icon: 'pi pi-sitemap' }, { icon: 'pi pi-book' }, { icon: 'pi pi-wallet' }, { icon: 'pi pi-shopping-bag' }, { icon: 'pi pi-calculator' }]);

</script>

<template>
  <div class="w-screen flex h-[70px] items-center bg-white shadow-lg inset-x-0 top-0 fixed justify-center z-40">
    <div class="flex container w-[100%]">
      <span class="flex items-center w-[70%]">
          <a class="text-primary flex" href="/">
            <img class="logo" src="/assets/graphics/logo_runpix.png"> {{site}}
          </a>
      </span>
      <div class="sm:flex items-center w-[30%]  justify-center">
        <div v-if="userState.isSignIn">
          <router-link to="/" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
             <i class="pi pi-home" style="font-size: 1.5rem"></i>
          </router-link>
          <router-link to="/profile" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
            <i class="pi pi-user" style="font-size: 1.5rem"></i>
          </router-link>
          <!-- <Breadcrumb :home="home" :model="items">
            <template #item="{item}">
                <a :class="item.class">
                    <span :class="item.icon"></span>
                </a>
            </template>
        </Breadcrumb> -->
        </div>
        <div v-else>
          <router-link to="/login" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
             <i class="pi pi-home" style="font-size: 1.5rem"></i>
          </router-link>
          <!-- <router-link to="/register" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
            Register
          </router-link> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
img.logo {
  max-height: 5vw;
}
</style>