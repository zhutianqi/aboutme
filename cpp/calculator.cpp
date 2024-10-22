//
//  Copyright © Uber Technologies, Inc. All rights reserved.
//


#include "calculator.hpp"
#include <stack>
#include <cstring>
#include <cstdlib>
#include <cctype>
#include <iostream>

extern "C" {
void help(std::stack<int>& res, std::stack<char>& op, std::stack<int>& last_num, std::stack<char>& last_op, int num) {
    if (op.top() == '+') {
        res.top() += num;
        last_op.top() = '+';
        last_num.top() = num;
    } else if (op.top() == '-') {
        res.top() -= num;
        last_op.top() = '-';
        last_num.top() = num;
    } else if (op.top() == '*') {
        if (last_op.top() == '+') {
            res.top() -= last_num.top();
            res.top() += last_num.top() * num;
            last_num.top() *= num;
        } else {
            res.top() += last_num.top();
            res.top() -= last_num.top() * num;
            last_num.top() *= num;
        }
    } else if (op.top() == '/') {
        if (last_op.top() == '+') {
            res.top() -= last_num.top();
            res.top() += last_num.top() / num;
            last_num.top() /= num;
        } else {
            res.top() += last_num.top();
            res.top() -= last_num.top() / num;
            last_num.top() /= num;
        }
    }
}

int calculate(const char* s) {
    std::stack<int> res;
    std::stack<int> last_num;
    std::stack<char> op;
    std::stack<char> last_op;
    res.push(0);
    last_num.push(0);
    op.push('+');
    last_op.push('+');

    int len = strlen(s);  // 获取字符串的长度

    for (int i = 0; i < len; i++) {
        if (isdigit(s[i])) {
            std::string s_num = "";
            while (i < len && isdigit(s[i])) {
                s_num.push_back(s[i++]);
            }
            i--;
            int num = std::stoi(s_num);
            help(res, op, last_num, last_op, num);
        } else if (s[i] == '(') {
            res.push(0);
            last_num.push(0);
            op.push('+');
            last_op.push('+');
        } else if (s[i] == ')') {
            int num = res.top();
            op.pop();
            res.pop();
            last_num.pop();
            last_op.pop();
            help(res, op, last_num, last_op, num);
        } else if (s[i] == '+' || s[i] == '-' || s[i] == '*' || s[i] == '/') {
            op.top() = s[i];
            if (s[i] == '+' || s[i] == '-')
                last_op.top() = s[i];
        }
    }
    return res.top();
}
}
