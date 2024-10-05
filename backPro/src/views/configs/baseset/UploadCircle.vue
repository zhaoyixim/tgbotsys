<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="轮播图"> </n-card>
    </div> 
    <n-card :bordered="false" class="mt-4 proCard">
      <n-grid cols="2 s:1 m:3 l:3 xl:3 2xl:3" responsive="screen">
        <n-grid-item offset="0 s:0 m:1 l:1 xl:1 2xl:1">
          <n-form
            :label-width="80"
            :model="formValue"
            :rules="rules"
            label-placement="left"
            ref="formRef"
            class="py-8"
          >
            <n-form-item label="轮播图" path="images">
              <BasicUpload
                :action="uploadImagesUrl"
                :headers="uploadHeaders"
                :data="{ type: 0 }"
                name="files"
                :width="100"
                :height="100"
                @uploadChange="uploadChange"      
                @delete="deleteImages"             
                v-model:value="formValue.images"
                helpText="单个文件不超过2MB，最多只能上传10个文件"
              />
            </n-form-item>
            <div v-if="false" style="margin-left: 80px">
              <n-space>
                <n-button type="primary" @click="formSubmit">提交</n-button>
                <n-button @click="resetForm">重置</n-button>
              </n-space>
            </div>
          </n-form>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, reactive } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicUpload } from '@/components/Upload';
  import { getAppEnvConfig } from '@/utils/env';
  import {deleImg,getImgs} from  "@/api/system/upload";

  const {VITE_GLOB_API_URL} = getAppEnvConfig();
  const uploadImagesUrl = ref(VITE_GLOB_API_URL+'/api/v1/apimultiupload')
  const rules = {   
    images: {
      required: true,
      type: 'array',
      message: '请上传轮播图图片',
      trigger: 'change',
    },
  };

  const formRef: any = ref(null);
  const message = useMessage();
  const imageStore = ref();
  const formValue = reactive({
    name: '',  
    mobile: '',
    //图片列表 通常查看和编辑使用 绝对路径 | 相对路径都可以
    images: [], 
  }); 
  let formImages = []
  const uploadHeaders = reactive({
    platform: 'miniPrograms',
    timestamp: new Date().getTime(),
    token: 'Q6fFCuhc1vkKn5JNFWaCLf6gRAc5n0LQHd08dSnG4qo=',
  });  

  const initData =async ()=>{
    let imgData = await getImgs({ })
    let imagesarr = [] 
    if(imgData.list.length>0){
      imgData.list.map(res=>{        
        imagesarr.push(VITE_GLOB_API_URL+res.imgurl)
      })
    }
    imageStore.value = imgData.list
    //保存到变量中
    formImages = imgData.list
    formValue.images =  imagesarr
    console.log(formValue.images ,"formValue.images ")
  }
  initData()

  function formSubmit() {
    formRef.value.validate((errors) => {
      if (!errors) {
        message.success('验证成功');
      } else {
        message.error('验证失败，请填写完整信息');
      }
    });
  }

  function resetForm() {
    formRef.value.restoreValidation();
  }
  async function deleteImages(items:any){     
      let imagesArr = formValue.images  
      delete imagesArr[items.index]
      formValue.images = imagesArr    
      const sendId = ref()
       imageStore.value.forEach((it,index)=>{
         if(index == items.index){
           sendId.value = it.id
         }         
       })
       let senddata = {
         id:sendId.value
       }
      await deleImg(senddata);
  } 
  function uploadChange(list: string[]) {
    //console.log(unref(list),"list")
   // formValue.images = unref(list);
  }
</script>
