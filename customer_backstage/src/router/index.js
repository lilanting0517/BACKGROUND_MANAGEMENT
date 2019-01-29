import Vue from 'vue'
import Router from 'vue-router'

const App = () =>
  import("@/App.vue")
/* 首页模版 */
const HomeGoods = () =>
  import("@/pages/Goods/HomeGoods.vue")
const HomePlatform = () =>
  import("@/pages/Platform/HomePlatform.vue")
const HomeCustomer = () =>
  import("@/pages/Customer/HomeCustomer.vue")
/* banner 第一页管理 */
const TopicActivity = () =>
  import("@/pages/Goods/TopicActivity")
const Banner1 = () =>
  import("@/pages/Goods/TopicActivity_banner/Banner1")
const Banner2 = () =>
  import("@/pages/Goods/TopicActivity_banner/Banner2")
const Banner3 = () =>
  import("@/pages/Goods/TopicActivity_banner/Banner3")
const AddBanner = () =>
  import("@/pages/Goods/TopicActivity_banner/AddBanner")
const IndexHotWord = () =>
  import("@/pages/Goods/IndexHotWord.vue")
const EditWord = () =>
  import("@/pages/Goods/IndexHotWord/EditWord.vue")
const AddWord = () =>
  import("@/pages/Goods/IndexHotWord/AddWord.vue")
const BatchImport = () =>
  import("@/pages/Goods/IndexHotWord/BatchImport.vue")
const LatestBooks = () =>
  import("@/pages/Goods/LatestBooks.vue")
const Login = () =>
  import("@/pages/Goods/Login.vue")
const Register = () =>
  import("@/pages/Goods/Register.vue")
const GoodSellingBooks = () =>
  import("@/pages/Goods/GoodSellingBooks.vue")
const ImportantProdect = () =>
  import("@/pages/Goods/ImportantProdect.vue")
const LargeMiddleMaterial = () =>
  import("@/pages/Goods/LargeMiddleMaterial.vue")
const LargeMiddleLatestRecommed = () =>
  import("@/pages/Goods/LargeMiddleLatestRecommed.vue")
const Vocational = () =>
  import("@/pages/Goods/TeachingMaterialChoose/Vocational.vue")
const SecondaryVocational = () =>
  import("@/pages/Goods/TeachingMaterialChoose/SecondaryVocational.vue")
const University = () =>
  import("@/pages/Goods/TeachingMaterialChoose/University.vue")
const LargeMiddleSort = () =>
  import("@/pages/Goods/LargeMiddleSort.vue")
const LargeMiddleAddBook = () =>
  import("@/pages/Goods/LargeMiddleAddBook.vue")
const CreativeProducts = () =>
  import("@/pages/Goods/CreativeProducts.vue")
const GoodsList = () =>
  import("@/pages/Goods/GoodsList.vue")
const ImportantGoodsLists = () =>
  import("@/pages/Goods/ImportantGoods/ImportantGoodsLists.vue")
const LargeMiddlePublicMatain = () =>
  import("@/pages/Goods/LargeMiddlePublicMatain.vue")
const AddPublic = () =>
  import("@/pages/Goods/LargeMiddlePublicMatain/AddPublic.vue")
const GoodSellingBooksMatain = () =>
  import("@/pages/Goods/GoodSellingBooksMatain.vue")
const VariousProdectMatain = () =>
  import("@/pages/Goods/VariousProdectMatain.vue")
const SingleAdd = () =>
  import("@/pages/Goods/VariousProdectMatain/GoodsMatain/SingleAdd.vue")
const ImportBatch = () =>
  import("@/pages/Goods/VariousProdectMatain/GoodsMatain/ImportBatch.vue")
const ImportantProdectMatain = () =>
  import("@/pages/Goods/ImportantProdectMatain.vue")
const LatestProdectMatain = () =>
  import("@/pages/Goods/LatestProdectMatain.vue")
const InterviewData = () =>
  import("@/pages/Goods/InterviewData.vue")
/**banner 第二页**/
const OrderDetail = () =>
  import("@/pages/Platform/OrderDetail.vue")
const ChildOrderDetail = () =>
  import("@/pages/Platform/childOrderDetail.vue")
const UserManagement = () =>
  import("@/pages/Platform/UserManagement.vue")
const BrandBusinessMatain = () =>
  import("@/pages/Platform/BrandBusinessMatain.vue")
const UnitAssociationMatain = () =>
  import("@/pages/Platform/UnitAssociationMatain.vue")
const RoleMatain = () =>
  import("@/pages/Platform/RoleMatain.vue")
const BackgroundPermissionsMangement = () =>
  import("@/pages/Platform/BackgroundPermissionsMangement.vue")
const BackgroundPermissionsMangementEdit = () =>
  import("@/pages/Platform/BackgroundPermissionsMangementEdit.vue")
const WarmGreeting = () =>
  import("@/pages/Platform/WarmGreeting.vue")
const ChannnelBarMatain = () =>
  import("@/pages/Platform/ChannelBarMatain.vue")
const PublicSortMatain = () =>
  import("@/pages/Platform/PublicSortMatain.vue")
const CollectionDataMatain = () =>
  import("@/pages/Platform/CollectionDataMatain.vue")

/**banner 第三页**/
const LatestBooksCustom = () =>
  import("@/pages/Customer/LatestBooksCustom.vue")
const ImportantProdectCustom = () =>
  import("@/pages/Customer/ImportantProdectCustom.vue")
const TopicActivityCustom = () =>
  import("@/pages/Customer/TopicActivityCustom.vue")
const GoodSellingBooksCustom = () =>
  import("@/pages/Customer/GoodSellingBooksCustom.vue")
const LargeMiddleMaterialCustom = () =>
  import("@/pages/Customer/LargeMiddleMaterialCustom.vue")
const VariousProdectCustom = () =>
  import("@/pages/Customer/VariousProdectCustom.vue")
const CustomerShopcarMessage = () =>
  import("@/pages/Customer/CustomerShopcarMessage.vue")
/***权限显示页****/
const NotFound = () =>
  import("@/components/NotFound")
Vue.use(Router)

export default new Router({
  // mode: "history",
  linkActiveClass: "show_border",
  routes: [
    {
      path: "/",
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/homegoods',
      name: 'homegoods',
      redirect: '/homegoods/topicactivity/banner1',
      component: HomeGoods,
      meta: {
        requireAuth: true,
        index: '1-2',
      },
      children: [
        {
          path: 'topicactivity',
          name: 'topicactivity',
          component: TopicActivity,
          children: [
            {
              path: "banner1",
              name: "banner1",
              meta: {
                requireAuth: true
              },
              component: Banner1
            },
            {
              path: "banner2",
              name: "banner2",
              component: Banner2,
              meta: {
                requireAuth: true
              }
            },
            {
              path: "banner3",
              name: "banner3",
              component: Banner3,
              meta: {
                requireAuth: true
              }
            }
          ]
        },
        {
          path: "topicactivity/add/:from",
          name: "add",
          component: AddBanner,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'indexhotword',
          name: 'indexhotword',
          meta: {
            index: '1-3',
            requireAuth: true
          },
          component: IndexHotWord
        },
        {
          path: "indexhotword/editword/:name",
          name: "editword",
          component: EditWord,
          meta: {
            requireAuth: true
          }
        },
        {
          path: "indexhotword/addword",
          name: "addword",
          component: AddWord,
          meta: {
            requireAuth: true
          }
        },
        {
          path: "indexhotword/batchimport/:word",
          name: "BatchImport",
          component: BatchImport,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'latestbooks',
          name: 'latestbooks',
          meta: {
            index: '1-4',
            requireAuth: true
          },
          component: LatestBooks
        },
        {
          path: 'goodsellingbooks',
          name: 'goodSellingBooks',
          meta: {
            index: '1-5',
            requireAuth: true
          },
          component: GoodSellingBooks
        },
        {
          path: 'importantprodect',
          name: 'importantprodect',
          meta: {
            index: '1-6',
            requireAuth: true
          },
          component: ImportantProdect
        },
        {
          path: "largemiddlematerial",
          name: "largemiddlematerial",
          meta: {
            index: '1-7',
            requireAuth: true
          },
          component: LargeMiddleMaterial
        },
        {
          path: "creativeproducts",
          name: "creativeproducts",
          meta: {
            index: '1-8',
            requireAuth: true
          },
          component: CreativeProducts
        },
        {
          path: "goodslist",
          name: "goodslist",
          meta: {
            index: '1-10',
            requireAuth: true
          },
          component: GoodsList
        },
        {
          path: "goodslist/importantgoodslist",
          name: "importantGoodslist",
          component: ImportantGoodsLists,
          meta: {
            requireAuth: true
          }
        },
        {
          path: "largemiddlepublicmatain",
          name: "largemiddlepublicmatain",
          meta: {
            index: '1-12',
            requireAuth: true
          },
          component: LargeMiddlePublicMatain
        },
        {
          path: "largemiddlepublicmatain/addpublic",
          name: "addpublic",
          component: AddPublic,
          meta: {
            requireAuth: true
          }
        },
        {
          path: "largemiddlelatestrecommed",
          name: "largemiddlelatestrecommed",
          component: LargeMiddleLatestRecommed,
          children: [
            {
              path: "university",
              name: "university",
              meta: {
                index: '1-13',
                requireAuth: true
              },
              component: University
            },
            {
              path: "vocational",
              name: "vocational",
              component: Vocational,
              meta: {
                requireAuth: true
              },
            },
            {
              path: "secondaryvocational",
              name: "secondaryvocational",
              component: SecondaryVocational,
              meta: {
                requireAuth: true
              },
            },
          ]
        },
        {
          path: "largemiddlesort",
          name: "largemiddlesort",
          meta: {
            index: '1-14',
            requireAuth: true
          },
          component: LargeMiddleSort
        },
        {
          path: "largemiddleaddbook/:id",
          name: "largemiddladdbook",
          meta: {
            requireAuth: true
          },
          component: LargeMiddleAddBook
        },
        {
          path: "goodsellingbooksmatain",
          name: "goodsellingbooksmatain",
          meta: {
            index: '1-15',
            requireAuth: true
          },
          component: GoodSellingBooksMatain
        },
        {
          path: "importantprodectmatain",
          name: "importantprodectmatain",
          meta: {
            index: '1-16',
            requireAuth: true
          },
          component: ImportantProdectMatain
        },
        {
          path: "latestprodectmatain",
          name: "latestprodectmatain",
          meta: {
            index: '1-17',
            requireAuth: true
          },
          component: LatestProdectMatain
        },
        {
          path: "variousprodectmatain",
          name: "variousprodectmatain",
          meta: {
            index: '1-18',
            requireAuth: true
          },
          component: VariousProdectMatain,
        },
        {
          path: "interviewdata",
          name: "interviewdata",
          meta: {
            index: '1-19',
            requireAuth: true
          },
          component: InterviewData
        },
        {
          path: "singleadd",
          name: "SingleAdd",
          component: SingleAdd
        },
        {
          path: "importbatch",
          name: "ImportBatch",
          component: ImportBatch
        }
      ]
    },
    {
      path: "/homeplatform",
      name: "homeplatform",
      component: HomePlatform,
      meta: {
        requireAuth: true
      },
      children: [
        // 用户信息管理
        {
          path: "usermanagement",
          name: "usermanagement",
          meta: {
            index: '2-2',
            requireAuth: true
          },
          component: UserManagement
        },
        // 角色维护
        {
          path: "rolematain",
          name: "rolematain",
          meta: {
            index: '2-3',
            requireAuth: true
          },
          component: RoleMatain
        },
        // 后台用户权限管理
        {
          path: "backgroundpermissionsmangement",
          name: "backgroundpermissionsmangement",
          meta: {
            index: '2-4',
            requireAuth: true
          },
          component: BackgroundPermissionsMangement
        },
        // 单位管理维护
        {
          path: "unitassociationmatain",
          name: "unitassociationmatain",
          meta: {
            index: '2-5',
            requireAuth: true
          },
          component: UnitAssociationMatain
        },
        // 区域业务员管理
        {
          path: "brandbusinessmatain",
          name: "brandbusinessmatain",
          meta: {
            index: '2-7',
            requireAuth: true
          },
          component: BrandBusinessMatain
        },
        {
          path: "backgroundpermissionsmangementedit",
          name: "backgroundpermissionsmangementedit",
          component: BackgroundPermissionsMangementEdit,
          meta: {
            requireAuth: true
          },
        },
        // 问候语管理
        {
          path: "warmgreeting",
          name: "warmgreeting",
          meta: {
            index: '2-8',
            requireAuth: true
          },
          component: WarmGreeting
        },
        // 出版社排序
        {
          path: "publicsortmatain",
          name: "publicsortmatain",
          meta: {
            index: '2-9',
            requireAuth: true
          },
          component: PublicSortMatain
        },
        // 二级频道管理
        {
          path: "channelbarmatain",
          name: "channebarmatain",
          meta: {
            index: '2-10',
            requireAuth: true
          },
          component: ChannnelBarMatain
        },
        //馆藏数据上传管理
        {
          path: "collectiondatamatain",
          name: "collectiondatamatain",
          meta: {
            index: '2-11',
            requireAuth: true
          },
          component: CollectionDataMatain
        },
        // 订单详情
        {
          path: "orderdetail",
          name: "orderdetail",
          meta: {
            index: '2-13',
            requireAuth: true
          },
          component: OrderDetail
        },
        {
          path: "childorderdetail",
          name: "childorderdetail",
          meta: {
            requireAuth: true
          },
          component: ChildOrderDetail
        }
      ],
    },
    {
      path: "/homecustomer",
      name: "homecustomer",
      component: HomeCustomer,
      meta: {
        requireAuth: true
      },
      children: [{
        path: "latestbookscustom",
        name: "latestbookscustom",
        meta: {
          index: '3-2',
          requireAuth: true
        },
        component: LatestBooksCustom
      },
      {
        path: "importantprodectcustom",
        name: "importantprodectcustom",
        meta: {
          index: '3-3',
          requireAuth: true
        },
        component: ImportantProdectCustom
      },
      {
        path: "topicactivitycustom",
        name: "topicactivitycustom",
        meta: {
          index: '3-4',
          requireAuth: true
        },
        component: TopicActivityCustom
      },
      {
        path: "goodsellingbookscustom",
        name: "goodsellingbookscustom",
        meta: {
          index: '3-5',
          requireAuth: true
        },
        component: GoodSellingBooksCustom
      },
      {
        path: "largemiddlematerialcustom",
        name: "largemiddlematerialcustom",
        meta: {
          index: '3-6',
          requireAuth: true
        },
        component: LargeMiddleMaterialCustom
      },
      {
        path: "variousprodectcustom",
        name: "variousprodectcustom",
        meta: {
          index: '3-7',
          requireAuth: true
        },
        component: VariousProdectCustom
      },
      {
        path: "customershopcarmessage",
        name: "customershopcarmessage",
        meta: {
          index: '3-9',
          requireAuth: true
        },
        component: CustomerShopcarMessage
      },
      ]
    },
    {
      path: "/notfound",
      component: NotFound
    },
    {
      path: '*',
      redirect: "Login"
    }
  ]
})
