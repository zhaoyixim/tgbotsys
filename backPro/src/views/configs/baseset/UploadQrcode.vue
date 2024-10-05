<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="收款码"> </n-card>
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
            <n-form-item label="收款码" path="images">
              <BasicUpload
                :action="uploadImagesUrl"
                :headers="uploadHeaders"
                :data="{ type: 0 }"
                name="files"
                :width="100"
                :height="100"
                maxNumber="1"
                @uploadChange="uploadChange"      
                @delete="deleteImages"             
                v-model:value="formValue.images"
                helpText="单个文件不超过2MB,只有一个收款码,通常是钱包或者合约代码"
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
  const uploadImagesUrl = ref(VITE_GLOB_API_URL+'/api/v1/upload/multiUploadcttype2')
  const rules = {   
    images: {
      required: true,
      type: 'array',
      message: '请上传收款码图片',
      trigger: 'change',
    },
  };

  const formRef: any = ref(null);
  const message = useMessage();

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
    let imgData = await getImgs({ctype:2})
    let imagesarr = []
    if(imgData.length>0){
      imgData.map(res=>{        
        imagesarr.push(VITE_GLOB_API_URL+res.photo)
      })
    }
    formImages = imgData
    formValue.images =  imagesarr
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
    if(items.image?._id){
      await deleImg({imgId:items._id});
    }else{     
      let imagesArr = formValue.images  
      delete imagesArr[items.index]
      formValue.images = imagesArr 
      await deleImg({imgId:formImages[items.index]._id});    
    }   
  } 
  function uploadChange(list: string[]) {
    //console.log(unref(list),"list")
   // formValue.images = unref(list);
  }
</script>
