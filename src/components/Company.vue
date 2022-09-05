<template>
  <div class="tree04">
    <div class="seeTree-page" id="app">
      <div id="treeRoot"></div>
    </div>
  </div>
</template>
<script>
import companyJson from "@/utils/companyJson";
import $ from "@/utils/jquery.min";
import * as d3 from "@/utils/d3.min";
import _ from "loadsh";

let svg;
let dirRight;
let forUpward;
let circlewidth1;
let circlewidth2;
let circlewidth3;
let leng;
let margin1 = { top: 50, right: 20, bottom: -20, left: 0 };
export default {
  data() {
    return {
      rootName: [],
      centralPoint: [0, 0], //画布中心点坐标x,y
      fontSize: 14, //字体大小，也是单字所占宽高
      rootNodeLength: 0, //根节点名称长度
      container: null, //容器svg>g
      themeColor: "#2196F3", //主色
      textSpace: 15, //多行文字间距
      scaleRange: [0.2, 2], //container缩放范围,D3.js中的zoom.scaleExtent()函数用于设置缩放扩展到指定的数字数组 [k0, k1]。k0 是允许的最小比例因子，k1 是允许的最大比例因子
      duration: 500, //动画持续时间
      direction: ["r", "l"], //分为左右2个方向
      root: { r: {}, l: {} }, //左右2块数据源
      nodeSize: [50, 100], //节点间距(高/水平)
      rectMinWidth: 50, //节点方框默认最小，
      textPadding: 5, //文字与方框间距,注：固定值5
      circleR: 5, //圆圈半径
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    treeMap() {
      return d3
        .tree()
        .nodeSize(this.nodeSize)
        .separation((a, b) => {
          //设置或取得两个节点之间的间距
          let result =
            a.parent === b.parent && !a.children && !b.children ? 1 : 2;
          return result;
        });
    },
  },
  methods: {
    getData() {
      this.rootName = [companyJson.data.rootName, ""];
      let data = companyJson.data; //原始数据
      let left = data.l; //左侧分支
      let right = data.r; //右侧分支
      let mynodes;
      for (let i = 0; i < left.children.length; i++) {
        if (left.children[i].children.length > 2) {
          mynodes = left.children[i].children;
          left.children[i].children = left.children[i].children.slice(0, 2);
          left.children[i].children[2] = {
            name: "更多",
            type: -1,
            val: mynodes.length - 2,
            childrend: mynodes.slice(),
          };
        }
      }
      for (let i = 0; i < right.children.length; i++) {
        if (right.children[i].children.length > 2) {
          mynodes = right.children[i].children;
          right.children[i].children = right.children[i].children.slice(0, 2);
          right.children[i].children[2] = {
            name: "更多",
            type: -1,
            val: mynodes.length - 2,
            childrend: mynodes.slice(),
          };
        }
      }
      this.treeInit(data);
    },
    treeInit(data) {
      const margin = { top: 0, right: 0, bottom: 0, left: 0 };
      let treeWidth = d3.select("#treeRoot")._parents[0].clientWidth;
      let treeHeight = d3.select("#treeRoot")._parents[0].clientHeight;
      const centralY = treeWidth / 2 + margin.left;
      const centralX = treeHeight / 2 + margin.top;
      this.centralPoint = [centralX, centralY]; //画布中心坐标
      this.rootNodeLength = this.rootName[0].length * this.fontSize + 50;

      // 创建画布
      svg = d3
        .select("#treeRoot")
        .append("svg")
        .attr("class", "tree-svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("width", treeWidth)
        .attr("height", treeHeight)
        .attr("font-size", this.fontSize)
        .attr("fill", "#555");

      // g标签
      this.container = svg
        .append("g")
        .attr("class", "container1")
        .attr(
          "transform",
          `translate(${margin1.left}, ${margin1.top})scale(0.8)`
        );

      //   画出根节点
      this.drawRoot();

      //   指定缩放范围
      const zoom = d3
        .zoom()
        .scaleExtent(this.scaleRange)
        .on("zoom", this.zoomFn);
      this.container
        .transition()
        .duration(this.duration)
        .call(zoom.transform, d3.zoomIdentity);
      svg.call(zoom); //绑定缩放事件
      //数据处理
      this.dealData(data);
    },
    zoomFn() {
      var weizhi = document.getElementsByClassName("container1")[0];
      weizhi.style.transform = ""; //偏移位置
      let zoom = d3.event.transform;
      return this.container.attr(
        "transform",
        "translate(" +
          (Number(zoom.x) + Number(margin1.left)) +
          "," +
          (zoom.y + margin1.top) +
          ")scale(" +
          zoom.k * 0.8 +
          ")"
      );
    },
    drawRoot() {
      const title = this.container
        .append("g")
        .attr("id", "rootTitle")
        .attr(
          "transform",
          `translate(${this.centralPoint[1]},${this.centralPoint[0]})`
        );
      title
        .append("svg:rect")
        .attr("class", "rootTitle")
        .attr("y", 0)
        .attr("x", -this.rootNodeLength / 2)
        .attr("width", this.rootNodeLength)
        .attr("height", 0)
        .attr("rx", 5)
        .style("fill", this.themeColor);

      this.rootName.forEach((name, index) => {
        title
          .append("text")
          .attr("fill", "white")
          .attr("y", function () {
            return 5;
          })
          .attr("text-anchor", "middle")
          .style("font-size", function () {
            if (index == 1) {
              return "10px";
            } else {
              return "15px";
            }
          })
          .text(name);

        let lineHeight = (index + 2) * this.textSpace;
        d3.select("#rootTitle rect")
          .attr("height", lineHeight)
          .attr("y", -lineHeight / 2);
      });
    },
    dealData(data) {
      this.direction.forEach((item) => {
        this.root[item] = d3.hierarchy(data[item]); //hierarchy这个API 用于生成树形层次结构的数据
        this.root[item].x0 = this.centralPoint[0]; //根节点x坐标
        this.root[item].y0 = this.centralPoint[1]; //根节点y坐标
        this.porData(this.root[item], item);
      });
    },
    porData(obj, item) {
      obj.descendants().forEach((d) => {
        d._children = d.children;
        d.id = item + this.uuid();
      });
      this.update(obj, item);
    },
    // 开始绘图
    update(source, direction) {
      let that = this;
      dirRight = direction === "r" ? 1 : -1; //方向为左/右
      forUpward = direction === "r";
      let className = `${direction}gNode`;
      let tree = this.treeMap(this.root[direction]);
      let nodes = tree.descendants();
      let links = tree.links(); //tree.links(nodes)根据节点数组返回节点之间的父子连接关系

      nodes.forEach((d) => {
        d.y = dirRight * (d.y + this.rootNodeLength / 2) + this.centralPoint[1];
        d.x = d.x + this.centralPoint[0];
      });
      //根据class名称获取左或者右的g节点，达到分块更新
      const node = this.container
        .selectAll(`g.${className}`)
        .data(nodes, (d) => d.id);

      //   新增节点，tree会根据数据内的children扩展相关节点
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("id", (d) => `g${d.id}`)
        .attr("class", className)
        .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", function (d) {
          d3.select(this)
            .selectAll(".node-circle .node-circle-vertical")
            .transition()
            .duration(that.duration)
            .attr("stroke-width", function (d) {
              if (d.children) {
                return 1;
              } else {
                return 0;
              }
            });
          if (d.data.name == "更多") {
            return that.clickNode(d, direction, source);
          } else if (d.depth !== 0) {
            return that.clickNode(d, direction, source);
          }
        });
      nodeEnter.each((d) => {
        if (d.depth > 0) {
          this.drawText(`g${d.id}`, dirRight); //划左右两侧分支的企业名称
          if (d.data.attName) {
            this.drawCodeText(`g${d.id}`, dirRight);
          }
          if (d.data.ratio) {
            this.drawTsText(`g${d.id}`, dirRight); //划百分比
          }
          this.drawRect(`g${d.id}`, dirRight); //划矩形
          this.marker(`g${d.id}`, dirRight); //划剪头

          this.drawCircle(`g${d.id}`, dirRight, source, direction);
          this.drawSign(`g${d.id}`, dirRight); //画标记
        }
        if (d.data && d.data.type == -1) {
          this.drawLength(`g${d.id}`, dirRight);
        }
      });
      // 更新节点：节点enter和exit时都会触发tree更新
      //   撑开
      const nodeUpdate = node
        .merge(nodeEnter)
        .transition()
        .duration(this.duration)
        .attr("transform", function (d) {
          if (d.data && d.data.isNextNode) {
            d3.select(this)
              .selectAll(".node-circle .node-circle-vertical")
              .transition()
              .duration(this.duration)
              .attr("stroke-width", function (d) {
                if (d.children) {
                  return 0;
                } else {
                  return 1;
                }
              });
          }

          var index = 0;

          return "translate(" + d.y + "," + d.x + ")";
        })
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // 移除节点:tree移除掉数据内不包含的节点(即，children = false)
      const nodeExit = node
        .exit()
        .transition()
        .duration(this.duration)
        .remove()
        .attr("transform", (d) => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);
      // Update the links 根据 className来实现分块更新
      const link = this.container
        .selectAll(`path.${className}`)
        .data(links, (d) => d.target.id);
      // Enter any new links at the parent's previous position.
      //insert是在g标签前面插入，防止连接线挡住G节点内容
      const linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", className)
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };

          return this.diagonal({ source: o, target: o });
        })
        .attr("fill", "none")
        .attr("stroke-width", 0.5)
        .attr("stroke", "#D8D8D8"); // Transition links to their new position.
      link
        .merge(linkEnter)
        .transition()
        .duration(this.duration)
        .attr("d", this.diagonal);

      //退出的时候删除线
      link
        .exit()
        .transition()
        .duration(this.duration)
        .remove()
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };

          return this.diagonal({ source: o, target: o });
        });
      // Stash the old positions for transition.
      this.root[direction].eachBefore((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },
    //点击某个节点ly
    clickNode(d, direction, source) {
      if (d.children || d.children) {
        this.collapse(d, direction, 1);
      } else {
        this.expand(d, direction, source);
      }
    },
    collapse(d, direction, obj) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
        console.log(d._children, "_children");
      }
      if (obj == 1) {
        this.update(d, direction);
      }
    },
    expand(d, direction, source) {
      if (d.data.name == "更多") {
        this.getNode(d, direction, source);
        return;
      }
      if (d._children) {
        d.children = d._children;

        d._children = null;
        this.update(d, direction);
      }
    },
    getNode(d, direction, source, type) {
      let mynodes;
      // 注释ly---start
      // if (!d.data.isNextNode && d.data.type != -1) {
      //   return;
      // }
      // 注释ly---end
      // console.log("重组数据");
      if (d.data.name == "更多") {
        var num = d.data.val / 5;
        if (num <= 5) {
          var arr = d.data.childrend;
        } else {
          var arr = d.data.childrend.slice(0, d.parent.children.length + 4);
          arr[d.parent.children.length + 4] = {
            nodeName: "更多",
            type: -1,
            val: d.data.childrend.length - d.parent.children.length + 4,
            childrend: d.data.childrend,
          };
        }
        var appendData = {
          children: arr,
        };
        this.DataReor(d.parent, direction, source, appendData);
      } else if (type == 1) {
        var appendData = {
          children: [],
        };
        this.DataReor(d, direction, source, appendData);
      } else {
        //请求数据
        // console.log(d.data, "请求数据参数 update");
        $("#loading,.shaow").show();
        let data = [];
        $("#loading,.shaow").hide();
        if (data.length == 0) {
          html =
            '<div class="tk"><p style="font-size: 14px;color: #359ffb">' +
            d.data.name +
            "</p><span>暂无数据</span></div>";
          $(".shaow").show();
          $("body").append(html);
          return;
        }
        mynodes = data;
        if (data.length > 10) {
          data = data.slice(0, 10);
          data[11] = {
            name: "更多",
            type: -1,
            val: mynodes.length - 10,
            childrend: mynodes.slice(0, mynodes.length),
          };
        }
        var appendData = {
          children: data,
        };
        this.DataReor(d, direction, source, appendData);
      }
    },
    //数据重组
    DataReor(d, direction, source, appendData) {
      var setDepth = function (node, num, appendLeaf) {
        //重新设置depth
        node.depth = num;
        if (node.children && node.children.length) {
          //遍历children
          node.children.forEach(function (item) {
            setDepth(item, num + 1, appendLeaf);
          });
        } else {
          appendLeaf.push(node);
        }
      };

      var setHeight = function (arr, num) {
        //重新设置height
        var parent = [];
        arr.forEach(function (node) {
          node.height = Math.max(num, node.height);
          if (node.parent && parent.indexOf(node.parent) == -1) {
            parent.push(node.parent);
          }
        });

        if (parent.length) {
          setHeight(parent, num + 1);
        }
      };

      var appendLeaf = []; //增加的叶子节点

      if (appendData.children.length) {
        d.children = [];
        appendData.children.forEach(function (item, index) {
          var newNode = d3.hierarchy(item);
          newNode.parent = d;
          newNode.height = -1;
          setDepth(newNode, d.depth + 1, appendLeaf);
          d.children.push(newNode);
        });
      }

      if (appendLeaf.length) {
        setHeight(appendLeaf, 0);
      }

      if (source.data.name == "更多") {
        source.parent.descendants().forEach((d) => {
          d._children = d.children;
          d.id = direction + this.uuid();
        });
      } else {
        source.descendants().forEach((d) => {
          d._children = d.children;
          d.id = direction + this.uuid();
        });
      }
      this.update(d, direction);
    },
    //画股票代码
    drawCodeText(id, dirRight) {
      return d3
        .select(`#${id} text`)
        .append("tspan")
        .attr("fill", (d) => "#fff")
        .attr("y", function (d) {
          if (d.data.ratio) {
            return this.textPadding + 8;
          }
        })
        .style("font-size", "11px")
        .attr("x", function (d) {
          if (dirRight > 0) {
            return this.textPadding;
          } else {
            return -5;
          }
        })
        .text(function (d) {
          return d.data.attName + " ";
        })

        .attr("width", function (d) {
          circlewidth3 = d3.select(this.getComputedTextLength())._groups[0][0];
          return d3.select(this.getComputedTextLength())._groups[0][0];
        });
    },
    diagonal({ source, target }) {
      let s = source,
        d = target;

      if (forUpward) {
        return (
          "M" +
          s.y +
          "," +
          s.x +
          "L" +
          (s.y + (d.y - s.y) - 20) +
          "," +
          s.x +
          "L" +
          (s.y + (d.y - s.y) - 20) +
          "," +
          d.x +
          "L" +
          d.y +
          "," +
          d.x
        );
      } else {
        return (
          "M" +
          s.y +
          "," +
          s.x +
          "L" +
          (s.y + (d.y - s.y) + 20) +
          "," +
          s.x +
          "L" +
          (s.y + (d.y - s.y) + 20) +
          "," +
          d.x +
          "L" +
          d.y +
          "," +
          d.x
        );
      }
    },
    //节点数量
    drawLength(id) {
      return d3
        .select(`#${id} text`)
        .append("tspan")
        .attr("fill", (d) => "#999")
        .text(function (d) {
          if (d.data.type == -1) {
            return " (" + d.data.val + ")";
          }
          return " [" + d.data.ratio + "]";
        })
        .attr("fill", "rgb(33, 150, 243)")
        .attr("width", function (d) {
          return d3.select(this.getComputedTextLength())._groups[0];
        });
    },
    //华标记
    drawSign(id, dirRight) {
      return d3
        .select(`#${id}`)
        .insert("circle", "text")
        .attr("cx", dirRight > 0 ? -5 : 5)
        .attr("y", -2.5)
        .attr("r", function (d) {
          if (d.data.nodeType == 0) {
            return 4;
          }
        })
        .style("fill", (d) => this.getRectStorke(d.data.name));
    },
    //画circle
    drawCircle(id, dirRight, source, direction) {
      let gMark = d3
        .select(`#${id}`)
        .append("g")
        .attr("class", "node-circle")
        .attr("stroke", "rgb(153, 153, 153)")
        .attr("transform", function (d) {
          if (d.data.ratio) {
            if (circlewidth1 > circlewidth2) {
              leng = Number(circlewidth1 || 0) + 15;
            } else {
              leng = Number(circlewidth2 || 0) + 15;
            }

            //leng = Number(circlewidth1) + Number(circlewidth2) + 25;
            if (leng > 390) {
              leng = 390;
            }
            if (dirRight == 1) {
              return "translate(" + leng + ",0)";
            } else {
              return "translate(" + -leng + ",0)";
            }
          } else {
            leng = Number(circlewidth1 || 0) + 15;
            if (dirRight == 1) {
              return "translate(" + leng + ",0)";
            } else {
              return "translate(" + -leng + ",0)";
            }
          }
        })
        // .attr('stroke-width', d => d.data.isNextNode ? 1 : 0);   判断是否有下级节点
        .attr("stroke-width", (d) => (d.data.type == "-1" ? 0 : 1));

      gMark
        .append("circle")
        .attr("fill", "none")
        .attr("r", function (d) {
          if (d.data.type == "-1") {
            return 0;
          }
          return 5;
        }) //根节点不设置圆圈
        .attr("fill", "#ffffff");
      let padding = this.circleR - 2;

      gMark.append("path").attr("d", `m -${padding} 0 l ${2 * padding} 0`); //横线

      gMark
        .append("path") //竖线，根据展开/收缩动态控制显示
        .attr("d", `m 0 -${padding} l 0 ${2 * padding}`)
        .attr("stroke-width", function (d) {
          if (d.data.type == "-1") {
            return 0;
          }
          return 1;
        })
        .attr("class", "node-circle-vertical");
      return gMark;
    },
    //画箭头
    marker(id, dirRight) {
      let gMark = d3
        .select(`#${id}`)
        .append("g")
        .attr(
          "transform",
          dirRight > 0 ? "translate(-20,0)" : "translate(12,0)"
        );
      return gMark
        .insert("path", "text")

        .attr("d", function (d) {
          if (d.data.nodeType == 0 && dirRight > 0) {
            return "M0,0L0,3L9,0L0,-3Z";
          } else if (d.data.nodeType == 0 && dirRight < 0) {
            return "M0,0L9,-3L9,3Z";
          }
        })
        .style("fill", (d) => this.getRectStorke(d.data.name));
    },
    //画方框
    drawRect(id, dirRight) {
      let that = this;
      let realw = document.getElementById(id).getBBox().width + 25; //获取g实际宽度后，设置rect宽度, getBBox允许我们确定对象适合的最小矩形的坐标
      if (document.getElementById(id).getBBox().width > 400) {
        realw = 400;
      }

      return d3
        .select(`#${id}`)
        .insert("rect", "text")
        .attr("x", function (d) {
          if (dirRight < 0) {
            return -realw;
          } else {
            0;
          }
        })
        .attr("y", function (d) {
          if (d.data.ratio) {
            return -that.textSpace + that.textPadding - 11;
          } else {
            return -that.textSpace + that.textPadding - 4;
          }
        })
        .attr("width", function (d) {
          // if (d.data.isNextNode) {//判断是否有下级节点
          //     return realw
          // } else {
          //     return realw - 15
          // }
          return realw;
        })
        .attr("height", function (d) {
          if (d.data.ratio) {
            return that.textSpace + that.textPadding + 22;
          } else {
            return that.textSpace + that.textPadding + 8;
          }
        })
        .attr("stroke-width", (d) =>
          d.data.nodeType == 0 || d.data.type == -1 || d.data.attName ? 0 : 0.5
        )
        .attr("rx", 2) //圆角

        .style("stroke", (d) =>
          d.data.nodeType == -1 ? "" : that.getRectStorke(d.parent.data.name)
        )
        .style("fill", function (d) {
          if (d.data.nodeType == -1) {
            return "rgb(241, 241, 241)";
          } else if (d.data.nodeType == 0) {
            return that.getRectStorke(d.data.name);
          } else if (d.data.attName) {
            return "rgb(33, 150, 243)";
          } else {
            return "#fff";
          }
        });
    },
    //画子文本
    drawTsText(id, dirRight) {
      let that = this;
      return d3
        .select(`#${id} text`)
        .append("tspan")
        .attr("fill", (d) => (d.data.attName ? "#fff" : "#999"))
        .attr("y", function (d) {
          if (d.data.ratio) {
            return that.textPadding + 8;
          }
        })
        .attr("x", function (d) {
          if (dirRight > 0) {
            return that.textPadding;
          } else {
            return -5;
          }
        })
        .style("font-size", "11px")
        .text(function (d) {
          return d.data.ratio;
        })

        .attr("width", function (d) {
          return this.getComputedTextLength();
        });
    },
    drawText(id, dirRight) {
      let that = this;
      dirRight = dirRight > 0; //右为1，左为-1
      return d3
        .select(`#${id}`)
        .append("text")
        .attr("y", function (d) {
          if (d.data.ratio) {
            return that.textPadding - 8;
          } else {
            return that.textPadding;
          }
        })
        .attr("x", (d) => (dirRight ? that.textPadding : -that.textPadding))
        .attr("text-anchor", dirRight ? "start" : "end")
        .style("font-size", that.fontSize)
        .text(function (d) {
          const len = d.data.name.length;
          if (len > 20) {
            return d.data.name.substring(0, 20) + "...";
          } else {
            return d.data.name;
          }
        })
        .attr("fill", function (d) {
          if (d.data.nodeType == -1) {
            return "rgb(33, 150, 243)";
          } else if (d.data.nodeType == 0 || d.data.attName) {
            return "#000";
          } else {
            return "#333";
          }
        });

      // .attr("width", function (d) {
      //   circlewidth1 = this.getComputedTextLength();
      //   return circlewidth1;
      // });
    },
    testLength(data, dirRight) {
      let level = [],
        width1,
        width2;
      for (var i = 0; i < data.length; i++) {
        let newArr = new Array();
        for (var j = 0; j < data[i].length; j++) {
          if (data[i][j].data.ratio) {
            svg
              .append("text")
              .style("font-size", this.fontSize)
              .text(function (d) {
                const len = data[i][j].data.name.length;
                if (len > 20) {
                  return data[i][j].data.name.substring(0, 20) + "...";
                } else {
                  return data[i][j].data.name;
                }
              })
              .attr("class", "test")
              .attr("width", function (d) {
                width1 = this.getComputedTextLength(); //getComputedTextLength只需访问选择操作中的 DOM 元素this即可受益于批量节点处理D3
              });
            svg
              .append("text")
              .style("font-size", this.fontSize)
              .text((d) => data[i][j].data.ratio)
              .attr("class", "test")
              .attr("width", function (d) {
                width2 = this.getComputedTextLength();
              });
            $(".test").remove();
            newArr.push(
              _.max([parseInt(width1, 10), parseInt(width2, 10)]) + 100
            );
          } else {
            svg
              .append("text")
              .style("font-size", this.fontSize)
              .text(function (d) {
                if (data[i][j].data.name) {
                  const len = data[i][j].data.name.length;
                  if (len > 20) {
                    return data[i][j].data.name.substring(0, 20) + "...";
                  } else {
                    return data[i][j].data.name;
                  }
                }
              })
              .attr("class", "test")
              .attr("width", function (d) {
                width1 = this.getComputedTextLength();
                newArr.push(parseInt(width1, 10) + 100);
              });
          }
        }
        level.push(Math.max.apply(null, newArr));
      }
      this.seat(level, dirRight, data);
    },
    seat(newArr, dirRight, data) {
      for (var j = 0; j < newArr.length; j++) {
        if (j != 0) {
          for (var i = 0; i < data[j].length; i++) {
            data[j][i].y = data[j - 1][0].y + newArr[j - 1] - 40;
          }
        }
      }
    },
    uuid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return (
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4()
      );
    },
    //末 节点 边框颜色
    getRectStorke(name) {
      switch (name) {
        case "分支机构":
          return "rgb(255, 234, 218)";
        case "对外投资":
          return "rgb(215, 236, 255)";
        case "股东":
          return "rgb(211, 234, 241)";
        case "高管":
          return "rgb(237, 227, 244)";
        default:
          return "rgb(133, 165, 255)";
      }
    },
    isNull(val) {
      return val ? val : "";
    },
  },
};
</script>
<style scoped>
.tree04 {
  background: #fff;
  touch-action: none;
  padding: 0;
  margin: 0;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  font-family: "PingFangSC-Regular", "PingFangSC-Light", "PingFang SC",
    sans-serif, "Microsoft YaHei";
}
</style>
