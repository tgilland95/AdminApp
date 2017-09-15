var LSStudentScript = (function () {
      var d,
            b,
            n,
            e,
            o,
            k,
            g,
            h,
            a,
            f,
            l = 0,
            j = 0,
            m = 0,
            c = 0,
            i;
      $(function () {
            $("#tab-semester")
                  .on("click", ".courseDrop", function (p) {
                        p.preventDefault;
                        i(p, ".course");
                        return false
                  });
            $("#tab-semester").on("click", ".sectionDrop", function (p) {
                  p.preventDefault;
                  i(p, ".courseSection");
                  return false
            });
            $("#tab-semester").on("click", ".courseLink", function (q) {
                  var p = $(q.target);
                  if (!p.is("a")) {
                        p = p.closest("a")
                  }
                  goToCourse(p.attr("data-cid"));
                  if (q.stopPropagation !== undefined) {
                        q.stopPropagation()
                  }
                  return false
            });
            $("#tab-semester").on("click", ".sectionLink.newCourse, .subSectionLink.newCourse", function (q) {
                  var p = $(q.target);
                  if (!p.is("a")) {
                        p = p.closest("a")
                  }
                  changeCourseStudent(p.data("cid"), false, p.data("url"));
                  if (q.stopPropagation !== undefined) {
                        q.stopPropagation()
                  }
                  return false
            });
            $("#menu-toggle, #close-nav").on("click", function (p) {
                  p.preventDefault;
                  $("#tab-semester").toggleClass("open");
                  $(window).scrollTop(0)
            });
            k();
            $(window).on("resize", _.throttle(k, 250));
            n()
      });
      n = function () {
            $("#sidenav > a, #sidenav > ul")
                  .each(function () {
                        var p = $(this).clone();
                        $(".course.current .courseSection.current .sectionNav")
                              .removeClass("loading")
                              .append(p)
                  })
      };
      i = function (v, t) {
            var r,
                  s,
                  u,
                  q,
                  p;
            r = v.target;
            s = $(r).closest(t);
            q = s.hasClass("open");
            p = $(r).closest(".course");
            u = p.hasClass("load-nav");
            $(t + ".open").removeClass("open");
            if (!q) {
                  s.addClass("open")
            }
            if (u) {
                  var w = p
                        .find(".courseLink")
                        .data("cid");
                  p
                        .removeClass("load-nav")
                        .addClass("loading-nav");
                  a([w], p)
            }
      };
      e = function (r, p, q) {
            require([
                  "handlebars", "text!templates/student/controls/navigation/navigation.mustache"
            ], function (u, t) {
                  var s = u.compile(t);
                  _.each(p, function (v) {
                        var x = q.hasClass("current") || v === "top",
                              y = [
                                    "home",
                                    "pages",
                                    "discuss",
                                    "exam",
                                    "gradebook",
                                    "calendar",
                                    "syllabus"
                              ],
                              w = 0;
                        if (v === "top") {
                              r = r.top;
                              v = "pages";
                              y = ["Course List", "Combined Schedule", "Announcements", "Copyright Resources", "Course Reserve"]
                        }
                        _
                              .each(y, function (E) {
                                    if (r[v][E]) {
                                          var D = q.find(".courseSection"),
                                                C = D.length > w
                                                      ? $(D[w])
                                                      : false,
                                                B = C !== false,
                                                z = r[v][E],
                                                F = B
                                                      ? C.hasClass("open")
                                                      : false,
                                                A;
                                          w += 1;
                                          if (x && B && C.hasClass("current")) {
                                                return
                                          }
                                          z = _.extend({
                                                open: F,
                                                current: x,
                                                cid: v
                                          }, z);
                                          A = s(z);
                                          if (B) {
                                                C.replaceWith(A)
                                          } else {
                                                q
                                                      .find(".course-nav")
                                                      .append(A)
                                          }
                                    }
                              });
                        if (v === "pages") {
                              v = "top"
                        }
                        $(".course." + v).removeClass("loading-nav")
                  })
            })
      };
      a = function (q, p) {
            ajax("student", "/ajax/navigation/navigation.php", "", "", false, "getCourseNavigation", {
                  courses: q
            }, function (r) {
                  e(r, q, p);
                  return r
            }, function (r) {
                  console.log("Error loading navigation");
                  console.log(r);
                  p
                        .removeClass("loading-nav")
                        .addClass("load-nav");
                  return false
            })
      };
      k = function () {
            var t,
                  x,
                  v,
                  u,
                  y,
                  r,
                  q,
                  p;
            if ($("#menu-toggle:visible").length) {
                  return
            }
            y = $("#tab-semester");
            r = $("#tab-semester .semester");
            q = $("#tab-semester .courseLink");
            t = r.height();
            p = $(window).width();
            x = y.hasClass("narrow");
            v = y.hasClass("narrower");
            u = y.hasClass("narrowest");
            if (l === 0) {
                  l = o(q, 1)
            }
            if (t > 40) {
                  if (!x) {
                        if (!$(".smallCourseCode").length) {
                              b()
                        }
                        y.addClass("narrow");
                        if (j === 0 || j < m) {
                              j = o(q, 1)
                        }
                  } else {
                        if (!v) {
                              y.addClass("narrower");
                              if (m === 0 || m < c) {
                                    m = o(q, 1)
                              }
                        } else {
                              if (!u) {
                                    y.addClass("narrowest");
                                    if (c === 0) {
                                          c = o(q, 1)
                                    }
                              }
                        }
                  }
                  return setTimeout(k, 50)
            } else {
                  if (p > m + 25) {
                        y.removeClass("narrowest")
                  }
                  if (p > j + 25) {
                        y.removeClass("narrower")
                  }
                  if (p > l + 25) {
                        y.removeClass("narrow")
                  }
            }
      };
      o = function (r, p) {
            var q;
            q = 0;
            r.each(function () {
                  var s;
                  s = $(this);
                  return q += s.outerWidth(true) + p
            });
            return q
      };
      b = function () {
            var p,
                  r,
                  q;
            p = [];
            r = [];
            $(".courseCode").each(function () {
                  p.push($(this).html())
            });
            $(".courseNum").each(function () {
                  r.push($(this).html())
            });
            q = _.uniq(p);
            p = d(q);
            $(".courseCode").each(function () {
                  var s,
                        t;
                  t = $(this).html();
                  s = p[t];
                  $(this).after('<span class="smallCourseCode">' + s + "</span>")
            })
      };
      d = function (p) {
            var w,
                  r,
                  u,
                  x,
                  t,
                  s,
                  v,
                  q;
            x = {};
            w = {};
            for (t = 0, v = p.length; t < v; t++) {
                  r = p[t];
                  r = r.replace(/\s/g, "");
                  x = f(x, r)
            }
            for (s = 0, q = p.length; s < q; s++) {
                  r = p[s];
                  u = r.replace(/\s/g, "");
                  w[r] = h(u, x)
            }
            return w
      };
      h = function (r, p) {
            var q,
                  u,
                  t;
            t = p;
            q = 0;
            u = r.length;
            while (q < u) {
                  if (!t[r[q]] || t[r[q]].len < 2) {
                        break
                  }
                  t = t[r[q]];
                  q += 1
            }
            return r.substring(0, q + 1)
      };
      f = function (p, r) {
            var q,
                  u,
                  t;
            t = p;
            q = 0;
            u = r.length;
            while (q < u) {
                  if (t[r[q]] !== void 0) {
                        t = t[r[q]];
                        q += 1
                  } else {
                        break
                  }
            }
            while (q < u) {
                  t[r[q]] = {};
                  if (t.len === null) {
                        t.len = 1
                  } else {
                        t.len += 1
                  }
                  t = t[r[q]];
                  q += 1
            }
            return p
      };
      g = function (p, q) {
            return setTimeout(q, p)
      }
}).call(this);