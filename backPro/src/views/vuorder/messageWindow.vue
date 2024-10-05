<template>
    <n-drawer v-model:show="isDrawer" :width="width">
      <n-drawer-content :title="title" closable>
        <n-form
          :model="formParams"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="100"
        >
          <n-form-item label="类型" path="type">
            <span>聊天信息</span>
          </n-form-item>         
          
          <div class="home">         
              <div class="home-body" ref="srollBody"> 
                <div v-for="(message, index) of messages" 
                :key="index" :class='{ "active": message.isActive ,"home-body-item":true}'>
                  <img class="home-body-avator" :src="message.avatar" />
                  <div class="home-body-content">
                    <span class="username">{{ message.username }}</span>
                    <span class="content"  v-html="message.context"></span>
                  </div>
                </div>
              </div>                 
    
           </div>     

        </n-form>  
      
      </n-drawer-content>
    </n-drawer>
  </template>
  
  <script lang="ts">
    import { defineComponent, reactive, ref, toRefs } from 'vue';
    import { useDialog, useMessage } from 'naive-ui';
    import { getAllMessageList,getmessageLists } from "@/api/bid/lists";
    const rules = {     
    };
    export default defineComponent({
      name: 'messageWindow',
      components: {},
      emits: ['emitreloadTable'],
      props: {
        title: {
          type: String,
          default: '数据项',
        },
        width: {
          type: Number,
          default: 450,
        },       
      },
      setup(props,context) {
        const message = useMessage();
        const dialog = useDialog()
        const formRef: any = ref(null);
        const itemData = reactive({data:{}})
        const defaultValueRef = () => ({});      
       
        const state = reactive({
          isDrawer: false,
          subLoading: false,
          formParams: defaultValueRef(),
          placement: 'right',          
        });
        
        const  messages=ref([]); 

        async function openDrawer(data:Object) {
          itemData.data = data
          console.log("itemData",data)
          let returndata = await getAllMessageList({userId:data.userId,touserId:data.touserId})
          returndata.map(it => {
              if(it.userId == data.userId) {
                it.isActive = true;
                it.avatar = it.avatar
              }
          });

          messages.value = returndata
          console.log("returndata",returndata)
          state.isDrawer = true;
        }
  
        function closeDrawer() {
          state.isDrawer = false;
        }
  
        async function  formSubmit() {
          
        
        }  
       
        const forceFinish = async() =>{
            
        }
  
        return {
          messages,
          ...toRefs(state),         
          forceFinish,      
          formSubmit,          
          openDrawer,
          closeDrawer,
        };
      },
    });
  </script>
  
  <style lang="scss" scoped>
  .showTips{background-color: #FFDEAD;color: #EEAD0E;margin: auto;padding:15px 10px;
  margin: 20px;margin-bottom: 0; border-radius: 8px;text-align: center;}


.home {
  //position: relative;
  
  height: 100%;
  .home-body {
    position: absolute;
    bottom: 3rem;
    overflow-y: scroll;
    top: 3rem;
    -webkit-overflow-scrolling: touch;
    height: auto;
    width: 100%;
    padding-bottom: 30px;
    .home-body-item {
      display: flex;
      flex-direction: row;
      padding: 0.5rem;
      .home-body-avator {
        width: 50px;
        height: 50px;
        box-shadow: 0px 2px 6px 1px #ccc;
        border-radius: 5px;
        margin-top: 0.5rem;
      }
      .home-body-content {
        display: flex;
        flex-direction: column;
        margin: 0 0.5rem 0.5rem 0.5rem;
        .username {
          color: #999;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .content {
          word-break: break-word;
        }
      }
    }
    .active {
      flex-direction: row-reverse;
      .home-body-content {
        align-items: flex-end;
      }
    }
  }
  .home-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    .home-bottom-container {
      display: flex;
      flex-direction: row;
      border: 1px solid #999;
      border-radius: 10px;
      .weui-cell {
        flex: 1;
      }
    }
  }
}
</style>